-- AddForeignKey
ALTER TABLE "pelatihan" ADD CONSTRAINT "pelatihan_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "pegawai"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pengalaman_kerja" ADD CONSTRAINT "pengalaman_kerja_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "pegawai"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
