# TVI - Pemeriksaan Visual Temporal

Jumlah sensor yang mengorbit bumi semakin meningkat secara sistematis menghasilkan volume data yang lebih besar, yang dapat digabungkan untuk menghasilkan rangkaian waktu satelit yang lebih konsisten. Dalam penelitian ini kami memperkenalkan Kubus Data Seperti Landsat Brazil, sebuah inisiatif dengan tujuan untuk mengkompilasi pengamatan bulanan, sejak tahun 2000, yang kompatibel dengan grid cell Landsat 8-OLI (yaitu 30m), untuk menghasilkan rangkaian waktu yang konsisten dari gambar biofisik untuk seluruh wilayah Brasil. Implementasi kami, yang sedang berlangsung dan berbasis sumber terbuka, menggabungkan data dari 13 satelit (dan berbagai sensor), menggunakan pendekatan otomatis untuk memproyeksikan kembali, mengambil sampel ulang, dan mendaftarkan gambar. Menganggap sebagai area percontohan adegan Landsat 223/71, sekitar 2.300 gambar diunduh untuk seluruh periode penelitian dan evaluasi pendaftaran gambar Cbers otomatis dilakukan. Demikian pula, pendekatan mengenai penyaringan awan/bayangan dan penggabungan NDVI telah ditentukan. Hasil kami menunjukkan bahwa inisiatif yang sedang berlangsung ini konsisten, layak, dan memiliki potensi untuk berkontribusi pada studi dan produk yang terkait dengan pemetaan penutupan dan penggunaan lahan, estimasi karbon, dan pemantauan proses degradasi di ekosistem alam dan antropogenik.
[Lihat makalah konferensi untuk informasi lebih lanjut.](http://www.cartografia.org.br/cbc/2017/trabalhos/4/378.html)

![alt tag](https://raw.githubusercontent.com/lapig-ufg/tvi/master/docs/admin.png)

## Running:
 1. Start MongoDB
 ```
 mongod
 ```
 2. Start Server
 ```
 ./prod-start.sh
 ```
