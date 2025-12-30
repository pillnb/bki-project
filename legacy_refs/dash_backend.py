from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Models
class Employee(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    role: str = "User"  # SuperAdmin, Admin, User, Management
    password_hash: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    role: str = "User"
    password: str


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    employee_id: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class LoginRequest(BaseModel):
    employee_id: str
    password: str


class LoginResponse(BaseModel):
    token: str
    employee: EmployeeResponse


class ModuleAccess(BaseModel):
    name: str
    description: str
    icon: str
    path: str
    external_url: Optional[str] = None
    roles: List[str]
    is_active: bool


# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_jwt_token(employee_id: str, role: str) -> str:
    payload = {
        'employee_id': employee_id,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_employee(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_jwt_token(token)
    employee_id = payload.get('employee_id')
    
    employee = await db.employees.find_one({"employee_id": employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if isinstance(employee['created_at'], str):
        employee['created_at'] = datetime.fromisoformat(employee['created_at'])
    if isinstance(employee['updated_at'], str):
        employee['updated_at'] = datetime.fromisoformat(employee['updated_at'])
    
    return EmployeeResponse(**employee)


# Routes
@api_router.get("/")
async def root():
    return {"message": "BKI Dashboard API"}


@api_router.post("/auth/register", response_model=EmployeeResponse)
async def register_employee(employee_data: EmployeeCreate):
    # Check if employee_id already exists
    existing = await db.employees.find_one({"employee_id": employee_data.employee_id})
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    # Check if email already exists
    existing_email = await db.employees.find_one({"email": employee_data.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create employee
    password_hash = hash_password(employee_data.password)
    employee_dict = employee_data.model_dump(exclude={'password'})
    employee_obj = Employee(**employee_dict, password_hash=password_hash)
    
    doc = employee_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.employees.insert_one(doc)
    
    return EmployeeResponse(**employee_obj.model_dump())


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    employee = await db.employees.find_one({"employee_id": login_data.employee_id}, {"_id": 0})
    
    if not employee:
        raise HTTPException(status_code=401, detail="Invalid employee ID or password")
    
    if not employee.get('is_active', False):
        raise HTTPException(status_code=401, detail="Account is inactive")
    
    if not verify_password(login_data.password, employee['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid employee ID or password")
    
    token = create_jwt_token(employee['employee_id'], employee['role'])
    
    # Convert datetime strings
    if isinstance(employee['created_at'], str):
        employee['created_at'] = datetime.fromisoformat(employee['created_at'])
    if isinstance(employee['updated_at'], str):
        employee['updated_at'] = datetime.fromisoformat(employee['updated_at'])
    
    employee_response = EmployeeResponse(**employee)
    
    return LoginResponse(token=token, employee=employee_response)


@api_router.get("/auth/me", response_model=EmployeeResponse)
async def get_current_user(current_employee: EmployeeResponse = Depends(get_current_employee)):
    return current_employee


@api_router.get("/employees", response_model=List[EmployeeResponse])
async def get_employees(current_employee: EmployeeResponse = Depends(get_current_employee)):
    if current_employee.role not in ["SuperAdmin", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to view employees")
    
    employees = await db.employees.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    
    for emp in employees:
        if isinstance(emp['created_at'], str):
            emp['created_at'] = datetime.fromisoformat(emp['created_at'])
        if isinstance(emp['updated_at'], str):
            emp['updated_at'] = datetime.fromisoformat(emp['updated_at'])
    
    return employees


@api_router.get("/employees/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str, current_employee: EmployeeResponse = Depends(get_current_employee)):
    if current_employee.role not in ["SuperAdmin", "Admin"] and current_employee.employee_id != employee_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this employee")
    
    employee = await db.employees.find_one({"employee_id": employee_id}, {"_id": 0, "password_hash": 0})
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if isinstance(employee['created_at'], str):
        employee['created_at'] = datetime.fromisoformat(employee['created_at'])
    if isinstance(employee['updated_at'], str):
        employee['updated_at'] = datetime.fromisoformat(employee['updated_at'])
    
    return EmployeeResponse(**employee)


@api_router.put("/employees/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: str,
    update_data: EmployeeUpdate,
    current_employee: EmployeeResponse = Depends(get_current_employee)
):
    if current_employee.role not in ["SuperAdmin", "Admin"] and current_employee.employee_id != employee_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this employee")
    
    # Only SuperAdmin can change roles
    if update_data.role and current_employee.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Only SuperAdmin can change roles")
    
    update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.employees.update_one(
        {"employee_id": employee_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    updated_employee = await db.employees.find_one({"employee_id": employee_id}, {"_id": 0, "password_hash": 0})
    
    if isinstance(updated_employee['created_at'], str):
        updated_employee['created_at'] = datetime.fromisoformat(updated_employee['created_at'])
    if isinstance(updated_employee['updated_at'], str):
        updated_employee['updated_at'] = datetime.fromisoformat(updated_employee['updated_at'])
    
    return EmployeeResponse(**updated_employee)


@api_router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str, current_employee: EmployeeResponse = Depends(get_current_employee)):
    if current_employee.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Only SuperAdmin can delete employees")
    
    result = await db.employees.delete_one({"employee_id": employee_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"message": "Employee deleted successfully"}


@api_router.get("/modules", response_model=List[ModuleAccess])
async def get_modules(current_employee: EmployeeResponse = Depends(get_current_employee)):
    modules = [
        ModuleAccess(
            name="Tool Management",
            description="Manage inventory and tools",
            icon="Wrench",
            path="/tools",
            external_url="https://invtools.emergent.host/",
            roles=["SuperAdmin", "Admin", "User", "Management"],
            is_active=True
        ),
        ModuleAccess(
            name="Assignment Letters",
            description="Create and manage assignment letters",
            icon="FileText",
            path="/assignments",
            external_url="https://cvtracker.preview.emergentagent.com/dashboard",
            roles=["SuperAdmin", "Admin", "Management"],
            is_active=True
        ),
        ModuleAccess(
            name="Curriculum Vitae",
            description="Employee CV management",
            icon="User",
            path="/cv",
            external_url="https://emergent-cv-tool.preview.emergentagent.com/",
            roles=["SuperAdmin", "Admin", "User", "Management"],
            is_active=True
        ),
        ModuleAccess(
            name="Marketing",
            description="Marketing campaigns and materials",
            icon="TrendingUp",
            path="/marketing",
            external_url=None,
            roles=["SuperAdmin", "Admin", "Management"],
            is_active=False
        ),
        ModuleAccess(
            name="Project Control",
            description="Track and manage projects",
            icon="ClipboardList",
            path="/projects",
            external_url=None,
            roles=["SuperAdmin", "Admin", "Management"],
            is_active=False
        ),
        ModuleAccess(
            name="Health, Safety & Environment",
            description="HSE compliance and reporting",
            icon="ShieldCheck",
            path="/hse",
            external_url=None,
            roles=["SuperAdmin", "Admin", "User", "Management"],
            is_active=False
        ),
        ModuleAccess(
            name="Vendor Data",
            description="Vendor information and management",
            icon="Building2",
            path="/vendors",
            external_url=None,
            roles=["SuperAdmin", "Admin", "Management"],
            is_active=False
        ),
        ModuleAccess(
            name="KPI Dashboard",
            description="Key Performance Indicators",
            icon="BarChart3",
            path="/kpi",
            external_url=None,
            roles=["SuperAdmin", "Admin", "Management"],
            is_active=False
        )
    ]
    
    # Filter modules based on user role
    accessible_modules = [m for m in modules if current_employee.role in m.roles]
    
    return accessible_modules


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()