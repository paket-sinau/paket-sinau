/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Announcement,
  ClassRoom,
  ExamPackage,
  ExamSession,
  Question,
  Stimulus,
  SubjectInfo,
  SystemSettings,
  User,
} from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'matematika',
    nama: 'Matematika (TKA SD 2026)',
    singkatan: 'MTK',
    deskripsi: 'Bilangan Rasional, Operasi Bilangan Cacah & Pecahan, Geometri & Pengukuran, serta Pengolahan Data & Diagram',
    warnaTema: 'indigo',
    bgSoft: 'bg-indigo-50/80',
    badgeColor: 'text-indigo-700 bg-indigo-100/70',
    borderAccent: 'border-indigo-500',
    ikon: 'Calculator',
  },
  {
    id: 'bahasa_indonesia',
    nama: 'Bahasa Indonesia & Literasi Membaca',
    singkatan: 'BIND',
    deskripsi: 'Membaca Cerita Anak, Menemukan Ide Pokok, Kosakata Baku, Puisi, dan Tata Bahasa Sederhana',
    warnaTema: 'violet',
    bgSoft: 'bg-violet-50/80',
    badgeColor: 'text-violet-700 bg-violet-100/70',
    borderAccent: 'border-violet-500',
    ikon: 'BookOpen',
  },
  {
    id: 'ipa',
    nama: 'Ilmu Pengetahuan Alam (IPA / IPAS)',
    singkatan: 'IPA',
    deskripsi: 'Mahluk Hidup & Lingkungan, Bagian Tubuh Hewan/Tumbuhan, Sumber Energi, dan Daur Air',
    warnaTema: 'emerald',
    bgSoft: 'bg-emerald-50/80',
    badgeColor: 'text-emerald-700 bg-emerald-100/70',
    borderAccent: 'border-emerald-500',
    ikon: 'Atom',
  },
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'cls-1',
    nama: 'Kelas 6A',
    tingkat: 'VI',
    jurusan: 'Tematik',
    waliKelasId: 'usr-guru-1',
    waliKelasNama: 'Budi Santoso, S.Pd.',
    jumlahMurid: 4,
  },
  {
    id: 'cls-2',
    nama: 'Kelas 6B',
    tingkat: 'VI',
    jurusan: 'Tematik',
    waliKelasId: 'usr-guru-2',
    waliKelasNama: 'Siti Rahmawati, S.Pd.',
    jumlahMurid: 3,
  },
  {
    id: 'cls-3',
    nama: 'Kelas 5A',
    tingkat: 'V',
    jurusan: 'Tematik',
    waliKelasId: 'usr-guru-2',
    waliKelasNama: 'Siti Rahmawati, S.Pd.',
    jumlahMurid: 3,
  },
];

export const INITIAL_USERS: User[] = [
  // 1 Admin
  {
    id: 'usr-admin-1',
    username: 'admin',
    nama: 'Administrator Sistem CBT',
    email: 'admin@paketsinau.sch.id',
    role: 'admin',
    password: 'admin',
    aktif: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  // 2 Guru
  {
    id: 'usr-guru-1',
    username: 'guru.budi',
    nama: 'Budi Santoso, S.Pd.',
    email: 'budi.santoso@paketsinau.sch.id',
    role: 'guru',
    password: 'guru',
    mapelAjar: ['matematika', 'ipa'],
    aktif: true,
    createdAt: '2026-01-11T09:00:00Z',
  },
  {
    id: 'usr-guru-2',
    username: 'guru.siti',
    nama: 'Siti Rahmawati, S.Pd.',
    email: 'siti.rahmawati@paketsinau.sch.id',
    role: 'guru',
    password: 'guru',
    mapelAjar: ['bahasa_indonesia', 'ipa'],
    aktif: true,
    createdAt: '2026-01-11T09:30:00Z',
  },
  // 10 Murid SD
  {
    id: 'usr-murid-1',
    username: 'raditya.p',
    nama: 'Raditya Pratama',
    email: 'raditya@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6A',
    aktif: true,
    createdAt: '2026-01-15T07:00:00Z',
  },
  {
    id: 'usr-murid-2',
    username: 'annisa.r',
    nama: 'Annisa Rahmawati',
    email: 'annisa@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6A',
    aktif: true,
    createdAt: '2026-01-15T07:05:00Z',
  },
  {
    id: 'usr-murid-3',
    username: 'fajar.h',
    nama: 'Fajar Nugraha',
    email: 'fajar@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6A',
    aktif: true,
    createdAt: '2026-01-15T07:10:00Z',
  },
  {
    id: 'usr-murid-4',
    username: 'zahra.a',
    nama: 'Zahra Aulia',
    email: 'zahra@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6A',
    aktif: true,
    createdAt: '2026-01-15T07:15:00Z',
  },
  {
    id: 'usr-murid-5',
    username: 'dimas.s',
    nama: 'Dimas Setiawan',
    email: 'dimas@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6B',
    aktif: true,
    createdAt: '2026-01-15T07:20:00Z',
  },
  {
    id: 'usr-murid-6',
    username: 'nadia.p',
    nama: 'Nadia Putri',
    email: 'nadia@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6B',
    aktif: true,
    createdAt: '2026-01-15T07:25:00Z',
  },
  {
    id: 'usr-murid-7',
    username: 'rizky.f',
    nama: 'Rizky Firmansyah',
    email: 'rizky@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6B',
    aktif: true,
    createdAt: '2026-01-15T07:30:00Z',
  },
  {
    id: 'usr-murid-8',
    username: 'cinta.k',
    nama: 'Cinta Kirana',
    email: 'cinta@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 5A',
    aktif: true,
    createdAt: '2026-01-15T07:35:00Z',
  },
  {
    id: 'usr-murid-9',
    username: 'kevin.a',
    nama: 'Kevin Aditya',
    email: 'kevin@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 5A',
    aktif: true,
    createdAt: '2026-01-15T07:40:00Z',
  },
  {
    id: 'usr-murid-10',
    username: 'tiara.m',
    nama: 'Tiara Maharani',
    email: 'tiara@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 5A',
    aktif: true,
    createdAt: '2026-01-15T07:45:00Z',
  },
];

export const INITIAL_STIMULI: Stimulus[] = [
  {
    id: 'stm-1',
    judul: 'Wacana 1: Dinamika Rantai Makanan & Jaring-Jaring Ekosistem Pesisir Mangrove',
    teks: `Hutan mangrove merupakan ekosistem transisi penting antara daratan dan laut tropis. Sebagai produsen primer utama, pohon bakau (*Rhizophora mangle*) dan lamun menghasilkan serasah daun (detritus) dalam jumlah masif. Serasah ini diurai oleh fungi dan bakteri menjadi detritus halus yang dikonsumsi oleh zooplankton, siput mangrove, kepiting sesarmid, dan ikan belanak (*Liza spp.*).

Pada tingkat trofik ketiga, udang dan ikan-ikan kecil menjadi mangsa bagi predator karnivora sekunder seperti ikan kakap abu-abu (*Lutjanus griseus*) dan burung kuntul biru (*Ardea herodias*). Di puncak jaring makanan pesisir (apex predators / konsumen tersier), bertengger burung elang tiram (*Pandion haliaetus*), ikan barakuda, dan hiu banteng (*Carcharhinus leucas*).

Kerusakan hutan bakau akibat konversi lahan tambak udang intensif terbukti memutus suplai detritus basal hingga 65%, menurunkan keanekaragaman moluska hingga separuhnya, serta memicu penurunan drastis populasi benih ikan laut komersial di kawasan lepas pantai.`,
    sumber: 'Jurnal Ekologi Tropika & Pesisir Indonesia (2025)',
    gambarUrl: '/src/assets/images/stimulus_ipa_ekosistem_1793242666027.jpg',
    gambarAlt: 'Diagram Jaring-Jaring Makanan Ekosistem Pesisir Mangrove',
  },

  {
    id: 'stm-bind-1',
    judul: 'Indahnya Hutan-Hutan Mangrove di Indonesia',
    teks: `Hutan Mangrove di Kulon Progo, Yogyakarta adalah tempat yang menyuguhkan keindahan alam menyejukkan hati. Hutan ini terletak di dekat Pantai Congot, kawasan ini terbagi menjadi beberapa zona menarik seperti Pasir Mendit, Jembatan Api-Api, dan Pantai Kadilangu. Luasnya mencapai sekitar tiga kilometer persegi, dipenuhi pohon-pohon bakau dengan akar unik yang menjulur di atas air.

Begitu melangkah ke dalam area, pengunjung akan disambut oleh jembatan kayu dan suasana rindang yang membuat hati tenang. Banyak spot foto menarik seperti ayunan, gazebo, dan menara pandang. Tak heran jika tempat ini disebut sebagai "permata tersembunyi" di Kulon Progo.

Selain indah, hutan ini juga menjadi rumah bagi beragam satwa seperti burung kuntul, kepiting, udang, dan biawak kecil. Ada jalur kayu yang bisa dilewati sambil menikmati semilir angin pantai. Jika ingin lebih dekat dengan alam, pengunjung juga bisa naik perahu menyusuri rimbunnya hutan.

Hutan Mangrove Kulon Progo bukan hanya indah dipandang mata, tapi juga punya peran penting bagi lingkungan. Tempat ini ibarat "paru-paru kecil" pesisir yang menjaga alam tetap seimbang sekaligus menjadi lokasi belajar mencintai alam sejak dini.`,
    sumber: 'Kompas Yogyakarta, Detik Jogja & Kompasiana',
  },
  {
    id: 'stm-bind-2',
    judul: 'Keunikan & Asal-Usul Bakwan',
    teks: `Bakwan merupakan makanan unik yang banyak disukai. Bakwan muncul karena pengaruh dari berbagai budaya, seperti Cina, Jepang, bahkan Eropa (Portugis).

Awalnya, bakwan terbuat dari daging dan tepung yang digoreng. Di Jepang, sayur yang digoreng tepung disebut "tempura". Makanan tersebut bisa jadi ikut mempengaruhi berkembangnya bakwan di Indonesia.

Kini, bakwan berisi aneka sayuran, seperti taoge, kol, dan wortel, yang dicampur dengan adonan tepung berbumbu rempah. Bisa juga ditambahkan isian udang, sosis, atau bakso.

Nama bakwan berbeda di tiap daerah. Jakarta, Yogyakarta, Manado, dan Lampung menyebutnya bakwan. Di banyak kota di Jawa Timur disebut ote-ote atau weci. Di Bandung disebut bala-bala. Sementara, di Semarang dan Pekalongan disebut badak.`,
    sumber: 'IDN Times & RRI.co.id',
  },
  {
    id: 'stm-bind-3',
    judul: 'Si Biru Kesayangan (Salma, Alvin, dan Siva)',
    teks: `Salma, Alvin, dan Siva sedang menikmati waktu istirahat.

Salma : (memeluk botol minumnya) "Minum dulu, ah! Botolku ini hadiah dari Ibu waktu ulang tahun. Aku beri nama dia Si Biru."
Alvin : "Hah? Botol aja dikasih nama? Aneh banget, Sal!"
Siva : "Ih, botol minum Salma lucu banget. Kamu tiap hari bawa Si Biru, ya?"
Salma : "Iya, dong. Si Biru sudah menemani aku setahun ini. Aku jadi nggak pernah beli minuman kemasan lagi!"
Alvin : "Ah, ribet. Aku sih, tinggal beli aja. Kalau sudah habis tinggal buang." (mengejek Salma)
Salma : "Vin, tahu, nggak? Plastik yang kamu buang itu bisa jadi sampah lingkungan bertahun-tahun. Bisa mencemari tanah dan air juga, lho."
Siva : "Benar, Vin. Aku juga sekarang bawa botol. Nih, gambar dinosaurus!"
Salma : "Kita nggak bisa terus tutup mata soal sampah plastik. Kita harus peduli. Mulai dari hal kecil, seperti bawa botol sendiri."
Alvin : "Hmm, kalau aku punya botol keren, mungkin aku jadi ingin bawa botol."
Salma : "Benar sekali. Kita bantu cari botol yang cocok buat kamu, deh."
Alvin : "Oke, setuju! Aku mau botol warna oranye, biar beda dari yang lain!"
Siva : "Siap, nanti kita cari bersama, ya!"`,
    sumber: 'Soal TKA Bahasa Indonesia SD/MI Tahun 2026',
  },
  {
    id: 'stm-bind-4',
    judul: 'Buku Harianku: Melihat Hujan Meteor bersama Ayah',
    teks: `Buku harianku,

Ayah akan mengajakku melihat hujan meteor. Meteor adalah batu atau debu antar-planet. Ketika meteor jatuh ke bumi, meteor terbakar karena gesekan lapisan udara bumi. Itu sebabnya, meteor terlihat seperti bintang jatuh atau bintang berpindah.

Aku berdoa supaya hari itu tidak hujan. Meteor tampak lebih jelas jika langit cerah. Jika aku beruntung, aku dapat melihat belasan meteor per jam.

Awalnya aku khawatir kalau bintang jatuh dapat menimpaku. Untunglah, ayah sudah menenangkanku. Hujan meteor tidak berbahaya, kok. Jangan takut, meteor ini akan habis terbakar di langit.

Duh, rasanya tidak sabar. Aku senang sekali menghabiskan waktu dengan ayah!`,
    sumber: 'BRIN — Akhir Juli 2022 Hujan Meteor Hiasi Langit Malam (Ilustrasi Gambar oleh Sonny)',
  },
  {
    id: 'stm-bind-5',
    judul: 'Giga si Segitiga',
    teks: `Giga si Segitiga mempunyai banyak ide. Dia senang menirukan bentuk. Dia sering mengajak teman-temannya bermain bersama.

Banyak bentuk yang bisa ditiru. Bentuk dan sudut yang sama membuat mereka selalu serasi. Contohnya pohon cemara, gunung, atap rumah, bendera, dan kipas angin.

Giga juga suka bermain dengan Pasukan Kotak. Banyak bentuk yang bisa ditirukan, seperti roket, ikan, dan menara.

Saat bermain dengan Heksagonal, dia menirukan bentuk bunga.

Bentuk mereka memang berbeda. Namun, mereka memiliki sudut-sudut yang pas.

Giga sedih Lingkaran tak mau bermain dengannya. Lingkaran takut pada sudut-sudut tajam milik Giga. Padahal, Giga bisa berhati-hati. Giga juga sudah membayangkan bentuk-bentuk yang bisa dibuat.`,
    sumber: 'Soal TKA Bahasa Indonesia SD/MI Tahun 2026',
    gambarUrl: '/assets/bind_tka_2026/q11_segitiga.png',
    gambarAlt: 'Ilustrasi bentuk segitiga: bendera, gunung, dan atap rumah',
  },
  {
    id: 'stm-bind-6',
    judul: 'Perayaan Cap Go Meh di Pulau Kemaro',
    teks: `Oleh: Avyubie Cantika Yuranda

Adit dan Danu senang sekali hari ini karena Ibu dan Ayah akan mengajak mereka pergi melihat perayaan Cap Go Meh di Pulau Kemaro. Masyarakat Tionghoa di Kota Palembang merayakan Cap Go Meh, dan orangtuanya ingin mengenalkan perayaan tersebut kepada mereka.

Ini adalah kedua kalinya Adit dan Danu pergi ke Pulau Kemaro. Waktu itu, mereka naik kapal dari bawah jembatan Musi. Kali ini, mereka akan menyeberangi sungai Musi dengan berjalan kaki di atas jembatan ponton, yang dipasang khusus saat perayaan Imlek setiap tahunnya. Mereka berangkat setelah makan malam.

Malam itu, banyak orang berjalan kaki melewati jembatan ponton ke Pulau Kemaro. Semua orang memakai baju merah, termasuk keluarga Adit dan Danu. Di Pulau Kemaro, mereka menyaksikan pertunjukkan barongsai dan penerbangan lampion. Acaranya sangat meriah. Adit dan Danu senang bisa mengenal kebudayaan Tionghoa melalui perayaan Cap Go Meh.

Namun, ketika mereka tiba di Pulau Kemaro, mereka kecewa karena hujan deras turun. Pertunjukkan barongsai dan penerbangan lampion harus dibatalkan. Adit dan Danu merasa sedih karena tidak bisa melihat semua acara yang telah mereka nantikan. Meskipun begitu, mereka tetap berusaha menikmati perayaan Cap Go Meh dengan berkeliling pulau dan mencoba makanan khas Imlek. Mereka belajar bahwa tidak semua hal bisa berjalan sesuai rencana, dan yang terpenting adalah tetap bersyukur dan menjalani dengan baik apa yang ada.`,
    sumber: 'Detik Sumbagsel, Bisnis Sumatra, Antara & Tribunnews',
  },
  {
    id: 'stm-bind-7',
    judul: 'Konsep Kota Berkelanjutan',
    teks: `Perubahan iklim, bencana alam, dan kesehatan manusia adalah masalah serius.
Untuk mengatasinya, pemerintah berupaya membangun kota berkelanjutan.
Kita perlu tahu ciri-ciri kota yang nyaman dan sehat.
Kota berkelanjutan memiliki transportasi publik ramah lingkungan dan murah.
Bus dan kereta tidak mencemari udara serta terjangkau.
Kendaraan pribadi juga harus ramah lingkungan, seperti mobil listrik.
Kota ini menyediakan jalur khusus untuk pejalan kaki dan pesepeda.
Listrik di kota berkelanjutan berasal dari tenaga surya.
Gedung-gedung dirancang hemat energi dan ramah lingkungan.
Penggunaan air pun dilakukan secara bijak dan efisien.
Fasilitas publik mudah diakses oleh semua orang.
Taman, perpustakaan, dan rumah sakit tersedia di berbagai lokasi.
Kota juga memiliki ruang terbuka hijau yang nyaman dan asri.
Kota berkelanjutan memperhatikan produksi makanan ramah lingkungan.
Pengelolaan sampah dilakukan dengan baik, termasuk daur ulang sampah.
Dengan semua ciri-ciri ini, kota menjadi sehat, nyaman, dan ramah lingkungan.
Mari jaga kota kita agar tetap berkelanjutan!`,
    sumber: 'Kompas Properti — Berkenalan dengan Konsep Kota Berkelanjutan Ramah Lingkungan',
  },
  {
    id: 'stm-bind-8',
    judul: 'Rara dan Tradisi Ruwatan',
    teks: `"Pokoknya Rara mau *hp* sebelum ruwatan!" Rengek Rara.
"Maaf, Nak! Ibu belum bisa membelikannya!" Terang Ibu.
"Jadi Rara tidak bisa ikut tradisi ruwatan?" tanyanya kesal.
Ibu sedih mendengar pertanyaan Rara.
Ayah yang tidak sengaja lewat, ikut mendengar.
"Rara! Kamu minta *hp*?" Tanya Ayah
"Iya!" Jawabnya
"Kata ketua adat, Rara boleh minta satu permintaan ke ayah ibu." Terang Rara.
"*Trus*, permintaan Rara itu harus dipenuhi, baru Rara bisa ikut ruwatan, Yah!" Lanjut Rara.
Ayah mengangguk, dan perlahan menjelaskan keadaan mereka.
Ibunya seorang pedagang kecil dan ayah hanya penjaga vila.
Jadi cukup berat untuk membelikan *hp*.
Rara sadar, dirinya tidak kaya dan meminta maaf ke Ayah dan Ibu.
Akhirnya Rara hanya meminta dibelikan buku cerita di pasar.
Tibalah hari Ruwatan, saat rambut Rara akan dipotong.
Rara sudah bersiap dengan baju adat.
"Wuah, bagus bajunya!" Kata Rara takjub.
"Ayo, Nak! Kamu harus segera bergabung dengan teman lainnya!" Perintah Ibu.
"Mau kemana, Bu?" Tanya Rara
Ibu menjelaskan kalau Rara akan dibawa ke tempat ritual ruwatan.
Di sana Ketua adat akan memotong rambut gimbal Rara.
"Setelah rambut Rara dipotong, Rara *ngapain*, Bu?"
"Penyerahan permintaan dan larung rambut!" Jawab Ibu dan Rara menjadi bingung.
"Ibu dan ayah akan memberikan barang yang kamu minta kemarin." Jawab Ibu
"Asik! Terima kasih, Bu!" ucap Rara.
"Tapi kamu harus tetap ikut acara larung rambut, ya, di sungai dekat desa!"
"Baik, Ibu!" Sambil memberikan jempol.

Daftar istilah:
*HP* = Handphone/ponsel/telepon genggam
Tradisi Ruwatan adalah tradisi mencukur rambut anak gimbal untuk melepaskan seseorang dari keburukan.`,
    sumber: 'Soal TKA Bahasa Indonesia SD/MI Tahun 2026',
  },
  {
    id: 'stm-bind-9',
    judul: 'Nilai Ujian Arul dan Belajar Bersama',
    teks: `Nilai Arul selalu bagus sejak dulu. Padahal, dia tidak pernah belajar. Tapi, nilai Arul mulai menurun.
Dewi : "Arul, belajar bareng, yuk! Bareng Reno dan Erni."
Arul : "Enggak mau, ah! Aku malas."
Dewi : "Ya, sudah. Aku belajar bareng dulu, ya."
Arul : "Belajar saja sana. Paling nilainya lebih bagus aku."
Arul : "Mending aku main bola."
Arul kembali bermain. Dia mengambil sepatunya. Dia berlari ke lapangan sambil membawa bola. Dia menendang bola ke gawang yang kosong.

Keesokan hari setelah ujian, Arul kaget saat melihat nilainya.
Arul : "Kok nilaiku jelek banget?"
Reno : "Emang apa yang kamu pelajari, Rul?"
Arul : "Buat apa aku belajar? Nilaiku loh selalu bagus."
Erni : "Ya, enggak bisa begitu, Arul. Pelajaran kita kan semakin susah."
Dewi : "Iya, kita sudah harus rajin belajar."
Arul : "Dulu aku tidak belajar. Nilaiku juga selalu bagus, 'kan?"
Reno : "Iya. Itu 'kan dulu. Lihat nilaimu sekarang. Semakin lama semakin jelek, 'kan?"
Arul hanya bisa memandangi nilainya.
Dewi : "Kamu harus belajar kalau mau nilai bagus."
Erni : "Iya. Berakit-rakit ke hulu, berenang-renang kemudian. Bersakit-sakit dahulu, bersenang-senang kemudian."
Dewi : "Betul. Harus berusaha kalau mau berhasil."
Arul : "Apa itu?"
Reno : "Peribahasa, Rul. Ayo belajar bareng biar sama-sama tahu."
Arul pun mengangguk.`,
    sumber: 'Soal TKA Bahasa Indonesia SD/MI Tahun 2026',
  },
  {
    id: 'stm-bind-10',
    judul: 'Yunus dan Kamal sang Nelayan',
    teks: `Sudah bertahun-tahun Yunus bekerja sebagai nelayan. Setiap hari ia mengarungi laut dan melempar jala. Asal tidak badai, Yunus pasti melaut.

Hal ini sangat berbeda dengan Kamal. Padahal keduanya sama-sama mencari hidup di laut. Tapi, Kamal sering bermalas-malasan.

Suatu hari, Kamal datang ke rumah Yunus.
"Yunus, bolehkah aku minta ikan?" kata Kamal.
"Lho, kamu tidak dapat ikan?" tanya Yunus. "Padahal lagi musim ikan, lho."
"Ah, itu. Aku kemarin tidak melaut. Aku sibuk memperbaiki perahuku yang rusak."
Merasa kasihan, Yunus memberikan beberapa ikan. Yunus juga mengingatkan Kamal untuk segera melaut.
Beberapa hari berlalu, Kamal masih belum melaut. Alasan Kamal seluas lautan. Tidak ada habisnya. Mulai dari ombak, perahu, sampai anak.

Semuanya dijadikan alasan oleh Kamal. Yunus sampai kesal.
Saat Kamal datang untuk meminta ikan lagi.
"Kamal, ayo melaut. Ikut aku kalau perahumu masih rusak," tegas Yunus.
"Waduh, belum bisa," tolak Kamal.
"Ikut saja. Aku kesal melihatmu bermalas-malasan setiap hari," kata Yunus.
"Orang kampung juga malas denganmu," kata Yunus. "Setiap hari hanya tiduran, lalu meminta ikan pada tetangga."
Kamal hanya terdiam. Kamal memang sudah semakin susah meminta ikan. Dengan berat, Kamal melawan rasa malasnya. Ia ikut Yunus melaut. Setiap hari, Kamal ikut dengan Yunus.

Sekarang Kamal sudah melaut setiap hari. Kamal bahkan melaut dengan perahunya sendiri.`,
    sumber: 'Soal TKA Bahasa Indonesia SD/MI Tahun 2026',
  },
  {
    id: 'stm-bind-11',
    judul: 'Mama, Aku Bukan Dia',
    teks: `Halo! Namaku Lianne. Aku suka sekali menggambar. Ini teman-temanku. Ada Albert, Giffari, dan Amber. Kami sedang bermain bersama.

Suatu hari, Albert memenangi lomba matematika. Sebagai temannya, aku sangat bangga kepadanya! Namun, saat aku pulang, Mama berkata, "Coba saja kamu pintar seperti Albert! Dia pintar matematika! Dia pasti rajin belajar!"

Aku tidak boleh mengecewakan Mama. Aku harus bisa seperti Albert. Namun, hasil belajarku semalam suntuk tetap saja tidak berhasil.

Saat aku jalan bersama Mama, aku bertemu Giffari. Dia sedang bermain basket. Keren sekali. "Coba saja kamu pandai bermain basket seperti Giffari!" seru Mama.

Aku berlatih basket. Susah sekali ternyata. Aku tidak bisa.

Saat pulang, aku melihat Amber sedang bernyanyi. Wah, merdu sekali! "Coba saja kamu pandai bernyanyi seperti Amber! Lihat! Bagus sekali, bukan?" seru Mama.

Aku mencoba menyanyi, "Bukan begitu!!! Nada kamu salah!!!" teriak Amber.

Uuuh! Aku kesal sekali. Lebih baik aku menggambar saja. Sebaiknya, aku melatih kemampuan menggambarku di luar. Bertemu dengan orang-orang. Berkeliling tempat berbeda. Mencari ide menarik. Menyenangkan sekali!

Wah, ada lomba menggambar! Aku pun mengirimkan gambarku. Beberapa hari kemudian, tiba-tiba Mama memberitahuku. Katanya, aku menang lomba menggambar! Mama bangga sekali denganku. Mama sadar bahwa setiap anak memiliki kelebihan masing-masing. Aku senang akhirnya Mama menerima bakatku apa adanya.`,
    sumber: 'Budi Kemdikbud — Baca Buku: Mama, Aku Bukan Dia',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  // ================= MATEMATIKA TKA SD/MI 2026 (30 SOAL RESMI) =================
  // MTK 1: KATEGORI (Bilangan Rasional - Potongan Objek Utuh)
  {
    id: 'mtk-1',
    mapelId: 'matematika',
    topik: 'Bilangan Rasional & Pecahan',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: 'Bangun datar berikut merupakan potongan yang terlihat mewakili bagian dari suatu objek utuh. Manakah dari gambar berikut ini yang merupakan gambar objek utuh tersebut? Tentukan Benar atau Salah pada setiap gambar berikut!',
    gambarUrl: '/assets/math_tka/q01_piece.png',
    gambarAlt: 'Potongan bangun datar persegi panjang mewakili 1/6 bagian utuh',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      {
        id: 'mtk1-stmt-1',
        teks: 'Objek Utuh 1 (Susunan 2 × 3 persegi panjang sama besar)',
        gambarUrl: '/assets/math_tka/q01_stmt1.png',
        kunciJawaban: 'Benar',
      },
      {
        id: 'mtk1-stmt-2',
        teks: 'Objek Utuh 2 (Susunan 3 kolom tidak sama lebar)',
        gambarUrl: '/assets/math_tka/q01_stmt2.png',
        kunciJawaban: 'Salah',
      },
      {
        id: 'mtk1-stmt-3',
        teks: 'Objek Utuh 3 (Susunan 3 kolom × 2 baris sama besar)',
        gambarUrl: '/assets/math_tka/q01_stmt3.png',
        kunciJawaban: 'Benar',
      },
    ],
    pembahasan: `1) Gambar 1 terbagi menjadi 6 bagian yang sama besar dan kongruen ($2 \\times 3$), masing-masing tepat mewakili $\\frac{1}{6}$ potongan objek. (Benar)
2) Gambar 2 bagian kolom tengah terlihat lebih sempit dibanding kolom kiri dan kanan sehingga bagian-bagiannya tidak sama besar. (Salah)
3) Gambar 3 terbagi menjadi 6 bagian persegi panjang yang kongruen dan sama besar ($3 \\times 2$). (Benar)`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:01:00Z',
    updatedAt: '2026-02-01T08:01:00Z',
  },
  // MTK 2: PILGAN (Bilangan Rasional - Pembangkit Listrik)
  {
    id: 'mtk-2',
    mapelId: 'matematika',
    topik: 'Bilangan Rasional & Persen',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Di sebuah negara, pembangkit listrik memanfaatkan berbagai sumber energi dengan kapasitas total $40.000\\text{ megawatt (MW)}$. Berdasarkan informasi pada gambar, pembangkit listrik yang menghasilkan energi paling besar berasal dari...',
    gambarUrl: '/assets/math_tka/q02_pembangkit.png',
    gambarAlt: 'Infografis perbandingan persentase dan pecahan kapasitas pembangkit listrik',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: 'PLTA' },
      { label: 'B', teks: 'PLTG' },
      { label: 'C', teks: 'PLTU' },
      { label: 'D', teks: 'PLTGU' },
    ],
    pembahasan: `Ubah semua porsi menjadi bentuk persen agar mudah dibandingkan:
• PLTU $= \\frac{1}{2} = 50\\%$ (terbesar ke-1, $20.000\\text{ MW}$)
• PLTGU $= 30\\%$ ($12.000\\text{ MW}$)
• PLTA $= 0{,}075 = 7{,}5\\%$ ($3.000\\text{ MW}$)
• PLTD $= \\frac{3}{40} = 7{,}5\\%$ ($3.000\\text{ MW}$)
• PLTG $= 5\\%$ ($2.000\\text{ MW}$)

Jadi sumber energi listrik paling besar berasal dari PLTU (Opsi C).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:02:00Z',
    updatedAt: '2026-02-01T08:02:00Z',
  },
  // MTK 3: MCMA (Bilangan Cacah - Pembagian 150 Karung Beras)
  {
    id: 'mtk-3',
    mapelId: 'matematika',
    topik: 'Faktor & Pembagian Bilangan Cacah',
    tingkatKesulitan: 'mudah',
    modelSoal: 'mcma',
    teksSoal: 'Sebanyak $150$ karung beras akan dibagikan sama banyak kepada beberapa keluarga, di mana setiap keluarga menerima lebih dari $1$ karung. Manakah kemungkinan banyaknya keluarga penerima bantuan beras tersebut? (Pilih semua jawaban yang benar)',
    gambarUrl: '/assets/math_tka/q03_karung_beras.png',
    gambarAlt: 'Ilustrasi karung beras jenis A (5 kg) dan jenis B (3 kg)',
    mcmaKunci: ['A', 'B'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: '$30$ keluarga' },
      { id: 'B', label: 'B', teks: '$25$ keluarga' },
      { id: 'C', label: 'C', teks: '$20$ keluarga' },
    ],
    pembahasan: `Agar dapat dibagikan sama rata dalam jumlah karung utuh (faktor dari $150$):
• $150 : 30 = 5$ karung/keluarga (habis dibagi dan $> 1$) $\\implies$ Benar.
• $150 : 25 = 6$ karung/keluarga (habis dibagi dan $> 1$) $\\implies$ Benar.
• $150 : 20 = 7{,}5$ karung (tidak habis dibagi bilangan bulat) $\\implies$ Salah.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:03:00Z',
    updatedAt: '2026-02-01T08:03:00Z',
  },
  // MTK 4: PILGAN (Operasi Bilangan Cacah - Karung Jenis B)
  {
    id: 'mtk-4',
    mapelId: 'matematika',
    topik: 'Operasi Hitung Bilangan Cacah',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Sebuah gudang memiliki persediaan beras sebanyak $1.500\\text{ kg}$. Seluruh beras akan dikemas menggunakan Karung Jenis B sesuai keterangan pada gambar, lalu dibagikan kepada $450$ keluarga dengan masing-masing menerima $1$ karung. Berapa sisa karung beras jenis B setelah dibagikan?',
    gambarUrl: '/assets/math_tka/q03_karung_beras.png',
    gambarAlt: 'Ilustrasi berat Karung Jenis A 5 kg dan Karung Jenis B 3 kg',
    pilganKunci: 'D',
    pilganOptions: [
      { label: 'A', teks: '$500$ karung.' },
      { label: 'B', teks: '$300$ karung.' },
      { label: 'C', teks: '$150$ karung.' },
      { label: 'D', teks: '$50$ karung.' },
    ],
    pembahasan: `Berat $1$ Karung Jenis B adalah $3\\text{ kg}$.
Banyak karung yang dihasilkan $= 1.500 : 3 = 500$ karung.
Dibagikan kepada $450$ keluarga (@ $1$ karung) $= 450$ karung.
Sisa karung beras $= 500 - 450 = 50$ karung.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:04:00Z',
    updatedAt: '2026-02-01T08:04:00Z',
  },
  // MTK 5: PILGAN (Kalimat Matematika - Karung Kentang)
  {
    id: 'mtk-5',
    mapelId: 'matematika',
    topik: 'Operasi Hitung Bilangan Cacah',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Seorang pedagang memiliki sekarung kentang seberat $100\\text{ kg}$. Setelah disortir, tersisa $4\\text{ kg}$ kentang yang belum dikemas. Kentang yang tersisa tersebut dikemas ke dalam kantong plastik sehingga setiap $1\\text{ kg}$ menjadi $6$ bungkus, lalu seluruh bungkus dimasukkan ke dalam kardus yang masing-masing berisi $12$ bungkus. Kalimat matematika yang tepat untuk menghitung banyaknya kardus adalah...',
    gambarUrl: '/assets/math_tka/q05_karung_kentang.png',
    gambarAlt: 'Karung kentang seberat 100 kg',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: '$(100 - 4) \\times 6 : 12$' },
      { label: 'B', teks: '$(100 - 4) : 6 \\times 12$' },
      { label: 'C', teks: '$(100 + 4) \\times 6 : 12$' },
      { label: 'D', teks: '$(100 + 4) : 6 \\times 12$' },
    ],
    pembahasan: `1) Berat kentang yang dikemas $= (100 - 4)\\text{ kg}$.
2) Setiap $1\\text{ kg}$ menjadi $6$ bungkus, maka total bungkus $= (100 - 4) \\times 6$.
3) Setiap kardus berisi $12$ bungkus, maka jumlah kardus $= (100 - 4) \\times 6 : 12$ (Opsi A).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:05:00Z',
    updatedAt: '2026-02-01T08:05:00Z',
  },
  // MTK 6: PILGAN (Operasi Campuran Pecahan)
  {
    id: 'mtk-6',
    mapelId: 'matematika',
    topik: 'Operasi Hitung Pecahan',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Hasil dari $\\frac{3}{25} \\times 3\\frac{7}{6} + 135 : 15$ adalah...',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: '$2\\frac{1}{2}$' },
      { label: 'B', teks: '$9\\frac{1}{30}$' },
      { label: 'C', teks: '$9\\frac{1}{2}$' },
      { label: 'D', teks: '$\\frac{32}{225}$' },
    ],
    pembahasan: `Dahulukan operasi perkalian dan pembagian:
• $3\\frac{7}{6} = \\frac{3 \\times 6 + 7}{6} = \\frac{25}{6}$
• $\\frac{3}{25} \\times \\frac{25}{6} = \\frac{3}{6} = \\frac{1}{2}$
• $135 : 15 = 9$
Jadi hasilnya $= \\frac{1}{2} + 9 = 9\\frac{1}{2}$ (Opsi C).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:06:00Z',
    updatedAt: '2026-02-01T08:06:00Z',
  },
  // MTK 7: KATEGORI (Diagram Alir Aritmetika)
  {
    id: 'mtk-7',
    mapelId: 'matematika',
    topik: 'Pola Bilangan & Diagram Alir',
    tingkatKesulitan: 'sulit',
    modelSoal: 'kategori',
    teksSoal: 'Sebuah program memiliki proses berpikir seperti pada diagram alir berikut. Tentukan Benar atau Salah pada setiap pernyataan berikut berdasarkan program tersebut!',
    gambarUrl: '/assets/math_tka/q07_flowchart.png',
    gambarAlt: 'Diagram alir operasi bilangan bulat',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'mtk7-stmt-1', teks: 'Jika bilangan yang dimasukkan adalah bilangan ganjil, maka hasil akhir juga bilangan ganjil.', kunciJawaban: 'Salah' },
      { id: 'mtk7-stmt-2', teks: 'Hasil akhir adalah nol jika bilangan yang dimasukkan adalah bilangan $0$.', kunciJawaban: 'Benar' },
      { id: 'mtk7-stmt-3', teks: 'Jika bilangan yang dimasukkan adalah bilangan genap, maka hasil akhir adalah bilangan kelipatan dua.', kunciJawaban: 'Benar' },
    ],
    pembahasan: `Perhatikan langkah terakhir sebelum "Hasil akhir": setiap cabang selalu melewati "Kalikan dengan 2".
1) Karena hasil akhir selalu dikali $2$, maka hasilnya pasti bilangan genap (tidak mungkin ganjil). (Salah)
2) Jika masuk $0$: $0 + 5 = 5$ (bukan kelipatan $6$ $\\implies$ Tidak) $\\implies 5 - 5 = 0 \\implies 0 \\times 2 = 0$. (Benar)
3) Bilangan apa pun (termasuk bilangan genap) setelah dikali $2$ selalu menghasilkan bilangan kelipatan dua. (Benar)`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:07:00Z',
    updatedAt: '2026-02-01T08:07:00Z',
  },
  // MTK 8: PILGAN (Persamaan Sederhana - Benda Magnet)
  {
    id: 'mtk-8',
    mapelId: 'matematika',
    topik: 'Penalaran & Persamaan Sederhana',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: `Tahukah kamu bahwa tidak semua benda dapat ditarik magnet?
Feromagnetik adalah benda yang mudah ditarik magnet. Paramagnetik adalah benda yang lemah ditarik magnet. Diamagnetik adalah benda yang sulit ditarik magnet.

Di dalam suatu wadah, terdapat $25$ benda yang berbeda jenisnya. Satu per satu benda tersebut akan dicoba didekati magnet. Ternyata $12$ di antaranya termasuk feromagnetik dan $7$ lainnya termasuk paramagnetik. Sisanya adalah benda diamagnetik. Setelah itu, benda tersebut ditambah sehingga menjadi $9$ benda diamagnetik. Berapakah benda diamagnetik yang baru ditambahkan?`,
    gambarUrl: '/assets/math_tka/q08_magnet.png',
    gambarAlt: 'Ilustrasi magnet ladam menarik penjepit kertas',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: '$3$ benda.' },
      { label: 'B', teks: '$5$ benda.' },
      { label: 'C', teks: '$9$ benda.' },
      { label: 'D', teks: '$15$ benda.' },
    ],
    pembahasan: `Jumlah benda diamagnetik awal $= 25 - (12 + 7) = 25 - 19 = 6$ benda.
Setelah ditambah menjadi $9$ benda diamagnetik, maka jumlah yang baru ditambahkan $= 9 - 6 = 3$ benda.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:08:00Z',
    updatedAt: '2026-02-01T08:08:00Z',
  },
  // MTK 9: MCMA (Operasi Bilangan - Daya Listrik Kincir Air)
  {
    id: 'mtk-9',
    mapelId: 'matematika',
    topik: 'Operasi Hitung Bilangan Cacah',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Tiga buah kincir air menghasilkan daya listrik per hari seperti pada gambar (Kincir A = $94\\text{ watt}$, Kincir B = $82\\text{ watt}$, Kincir C = $96\\text{ watt}$). Selama $2$ hari pemakaian, sisa daya listrik yang tidak terpakai pada Kincir A adalah $42\\text{ watt}$, Kincir B tersisa $13\\text{ watt}$, dan Kincir C tersisa $30\\text{ watt}$. Kincir manakah yang daya listrik terpakainya selama $2$ hari lebih dari $150\\text{ watt}$? (Pilih semua jawaban yang benar)',
    gambarUrl: '/assets/math_tka/q09_kincir_air.png',
    gambarAlt: 'Ilustrasi aliran sungai dengan Kincir A 94 watt, Kincir B 82 watt, dan Kincir C 96 watt',
    mcmaKunci: ['B', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Kincir A' },
      { id: 'B', label: 'B', teks: 'Kincir B' },
      { id: 'C', label: 'C', teks: 'Kincir C' },
    ],
    pembahasan: `Hitung daya listrik yang terpakai selama $2$ hari:
• Kincir A: $(2 \\times 94) - 42 = 188 - 42 = 146\\text{ watt}$ ($\\le 150\\text{ watt}$).
• Kincir B: $(2 \\times 82) - 13 = 164 - 13 = 151\\text{ watt}$ ($> 150\\text{ watt}$ $\\implies$ Benar).
• Kincir C: $(2 \\times 96) - 30 = 192 - 30 = 162\\text{ watt}$ ($> 150\\text{ watt}$ $\\implies$ Benar).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:09:00Z',
    updatedAt: '2026-02-01T08:09:00Z',
  },
  // MTK 10: PILGAN (Rasio Sederhana - Protein Ikan Salmon)
  {
    id: 'mtk-10',
    mapelId: 'matematika',
    topik: 'Perbandingan & Rasio Sederhana',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Perhatikan infografis manfaat ikan salmon di bawah ini. Jika seseorang ingin mendapatkan asupan protein sebanyak $80\\text{ gram}$ dari ikan salmon, berapa porsi ikan salmon yang harus dikonsumsi?',
    gambarUrl: '/assets/math_tka/q10_salmon.png',
    gambarAlt: 'Infografis Manfaat Ikan Salmon: Tinggi Protein 20 gram per porsi',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: '$8$ porsi.' },
      { label: 'B', teks: '$6$ porsi.' },
      { label: 'C', teks: '$4$ porsi.' },
      { label: 'D', teks: '$2$ porsi.' },
    ],
    pembahasan: `Berdasarkan infografis, kandungan protein ikan salmon adalah $20\\text{ gram}$ per porsi.
Banyak porsi yang dibutuhkan $= 80 : 20 = 4$ porsi.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:10:00Z',
    updatedAt: '2026-02-01T08:10:00Z',
  },
  // MTK 11: KATEGORI (Perbandingan Resep Keju)
  {
    id: 'mtk-11',
    mapelId: 'matematika',
    topik: 'Perbandingan & Rasio Sederhana',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: `Keju adalah produk olahan susu yang kaya protein dan dibuat melalui proses sederhana seperti pada gambar. Setiap $1$ resep pembuatan keju membutuhkan $2$ gelas susu ($1$ gelas $= 200\\text{ ml}$), $4$ sendok teh cuka ($1$ sendok teh $= 5\\text{ ml}$), dan garam sebanyak $4\\text{ gr}$.

Seseorang akan membuat keju sebanyak $5$ kali resep awal. Persediaan bahan yang dimiliki adalah $2.000\\text{ ml}$ susu sapi segar, $140\\text{ ml}$ cuka, dan $16\\text{ gr}$ garam. Apakah bahan yang tersedia cukup? Tentukan Benar atau Salah untuk setiap pernyataan berikut!`,
    gambarUrl: '/assets/math_tka/q11_keju.png',
    gambarAlt: 'Takaran bahan-bahan dan tahapan proses pembuatan keju sederhana',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'mtk11-stmt-1', teks: 'Seharusnya disediakan garam sebanyak $20\\text{ gr}$.', kunciJawaban: 'Benar' },
      { id: 'mtk11-stmt-2', teks: 'Terdapat kekurangan cuka sebanyak $40\\text{ ml}$.', kunciJawaban: 'Salah' },
      { id: 'mtk11-stmt-3', teks: 'Tidak perlu tambahan susu sapi segar.', kunciJawaban: 'Benar' },
    ],
    pembahasan: `Kebutuhan untuk $5$ kali resep:
• Susu $= 5 \\times (2 \\times 200\\text{ ml}) = 5 \\times 400 = 2.000\\text{ ml}$. Persediaan $2.000\\text{ ml}$ (pas, tidak perlu tambahan $\\implies$ Pernyataan 3 Benar).
• Cuka $= 5 \\times (4 \\times 5\\text{ ml}) = 5 \\times 20 = 100\\text{ ml}$. Persediaan $140\\text{ ml}$ berarti kelebihan $40\\text{ ml}$, bukan kekurangan (Pernyataan 2 Salah).
• Garam $= 5 \\times 4\\text{ gr} = 20\\text{ gr}$. Persediaan $16\\text{ gr}$, seharusnya $20\\text{ gr}$ (Pernyataan 1 Benar).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:11:00Z',
    updatedAt: '2026-02-01T08:11:00Z',
  },
  // MTK 12: MCMA (KPK & Kalender Laundry Koin)
  {
    id: 'mtk-12',
    mapelId: 'matematika',
    topik: 'KPK & FPB',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: `Laundry koin adalah tempat mencuci pakaian dengan mesin cuci besar. Linda mencuci di laundry tersebut setiap $8$ hari sekali, sedangkan Vidya setiap $6$ hari sekali pada jam kedatangan yang sama yaitu pukul $16.00$.

Pada tanggal $10$ Agustus $2024$, Linda dan Vidya bertemu di tempat laundry tersebut. Kapankah mereka akan bertemu kembali? (Pilih semua jawaban yang benar)`,
    gambarUrl: '/assets/math_tka/q12_laundry.png',
    gambarAlt: 'Jadwal Linda setiap 8 hari, Vidya setiap 6 hari, serta kalender Agustus dan September',
    mcmaKunci: ['A', 'B', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: '$3$ September $2024$' },
      { id: 'B', label: 'B', teks: '$27$ September $2024$' },
      { id: 'C', label: 'C', teks: '$21$ Oktober $2024$' },
    ],
    pembahasan: `KPK dari $8$ dan $6$ adalah $24$, sehingga mereka bertemu setiap $24$ hari sekali.
• Pertemuan berikutnya ke-1: $10$ Agustus $+ 24$ hari $= 34 - 31$ (jumlah hari Agustus) $= 3$ September $2024$ (Opsi A Benar).
• Pertemuan berikutnya ke-2: $3$ September $+ 24$ hari $= 27$ September $2024$ (Opsi B Benar).
• Pertemuan berikutnya ke-3: $27$ September $+ 24$ hari $= 51 - 30$ (jumlah hari September) $= 21$ Oktober $2024$ (Opsi C Benar).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:12:00Z',
    updatedAt: '2026-02-01T08:12:00Z',
  },
  // MTK 13: KATEGORI (Sifat Bangun Datar Huruf E)
  {
    id: 'mtk-13',
    mapelId: 'matematika',
    topik: 'Ciri & Sifat Bangun Datar',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: 'Perhatikan bentuk bangun datar huruf E berikut ini! Tentukan Benar atau Salah untuk setiap pernyataan mengenai sifat bangun datar tersebut:',
    gambarUrl: '/assets/math_tka/q13_huruf_e.png',
    gambarAlt: 'Bangun datar berbentuk huruf E berbahan kayu',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'mtk13-stmt-1', teks: 'Memiliki $12$ sisi.', kunciJawaban: 'Benar' },
      { id: 'mtk13-stmt-2', teks: 'Terdapat $12$ titik sudut.', kunciJawaban: 'Benar' },
      { id: 'mtk13-stmt-3', teks: 'Terdapat $10$ sudut siku-siku.', kunciJawaban: 'Salah' },
    ],
    pembahasan: `Jika kita menelusuri seluruh tepi huruf E:
1) Jumlah ruas garis pembentuk keliling luar huruf E adalah tepat $12$ sisi. (Benar)
2) Karena merupakan segi-$12$ tertutup, banyaknya titik sudutnya juga $12$ buah. (Benar)
3) Sudut dalamnya terdiri atas $8$ sudut cembung siku-siku ($90^\\circ$) dan $4$ sudut refleks bagian dalam lekukan ($270^\\circ$), bukan $10$ sudut siku-siku. (Salah)`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:13:00Z',
    updatedAt: '2026-02-01T08:13:00Z',
  },
  // MTK 14: KATEGORI (Bangun Penyusun Segi Banyak)
  {
    id: 'mtk-14',
    mapelId: 'matematika',
    topik: 'Segi Banyak & Komposisi Bangun Datar',
    tingkatKesulitan: 'sulit',
    modelSoal: 'kategori',
    teksSoal: 'Gambar berikut memperlihatkan sebuah segi banyak yang dibentuk dari gabungan beberapa bangun datar tanpa beririsan. Berikut ini adalah pernyataan banyak segitiga dan segiempat yang menyusun segi banyak tersebut. Tentukan Benar atau Salah pada setiap pernyataan berikut!',
    gambarUrl: '/assets/math_tka/q14_poligon.png',
    gambarAlt: 'Bangun segi banyak di atas kertas berpetak',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'mtk14-stmt-1', teks: '$3$ segitiga dan $1$ persegi panjang.', kunciJawaban: 'Benar' },
      { id: 'mtk14-stmt-2', teks: '$4$ segitiga dan $1$ trapesium.', kunciJawaban: 'Benar' },
      { id: 'mtk14-stmt-3', teks: '$5$ segitiga dan $1$ layang-layang.', kunciJawaban: 'Benar' },
    ],
    pembahasan: `Bangun segi banyak pada petak dapat dibagi dengan berbagai cara tanpa beririsan:
1) Pisahkan bagian tengah berupa $1$ persegi panjang ($4 \\times 2$) dan tersisa tepat $3$ segitiga di bagian atas, bawah, serta ujung kanan. (Benar)
2) Dari pemisahan di atas, jika persegi panjang tengah dipotong secara diagonal menjadi $1$ trapesium dan $1$ segitiga tambahan, terbentuk $4$ segitiga dan $1$ trapesium. (Benar)
3) Bangun tersebut juga dapat disusun dari $1$ layang-layang pada bagian kanan-tengah beserta $5$ buah segitiga pelengkap di sekelilingnya. (Benar)`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:14:00Z',
    updatedAt: '2026-02-01T08:14:00Z',
  },
  // MTK 15: PILGAN (Konstruksi Kubus Satuan)
  {
    id: 'mtk-15',
    mapelId: 'matematika',
    topik: 'Bangun Ruang & Visualisasi Spasial',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Gambar berikut memperlihatkan susunan kubus berukuran sama. Berdasarkan gambar tersebut, jumlah semua kubus yang mungkin adalah...',
    gambarUrl: '/assets/math_tka/q15_kubus.png',
    gambarAlt: 'Susunan tumpukan kubus satuan tampak tiga dimensi',
    pilganKunci: 'D',
    pilganOptions: [
      { label: 'A', teks: '$12$' },
      { label: 'B', teks: '$13$' },
      { label: 'C', teks: '$14$' },
      { label: 'D', teks: '$15$' },
    ],
    pembahasan: `Hitung jumlah kubus pada setiap kolom dari lapisan paling bawah hingga atas:
• Alas dasar memiliki $9$ posisi kolom kubus (setidaknya $1$ kubus pada tiap posisi) $= 9$ kubus.
• Tumpukan paling kiri memiliki $1$ kubus tambahan di tingkat ke-$2$.
• Menara tinggi di tengah-belakang memiliki $4$ kubus tambahan (tingkat $2, 3, 4, 5$).
• Tumpukan di belakang kanan menara memiliki $1$ kubus tambahan di tingkat ke-$2$.

Total kubus seluruhnya $= 9 + 1 + 4 + 1 = 15$ kubus (Opsi D).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:15:00Z',
    updatedAt: '2026-02-01T08:15:00Z',
  },
  // MTK 16: MCMA (Satuan Panjang Baku)
  {
    id: 'mtk-16',
    mapelId: 'matematika',
    topik: 'Pengukuran Panjang',
    tingkatKesulitan: 'mudah',
    modelSoal: 'mcma',
    teksSoal: 'Manakah di antara pernyataan berikut yang menggunakan perkiraan satuan ukuran panjang secara tepat dan masuk akal dalam kehidupan sehari-hari? (Pilih semua jawaban yang benar)',
    mcmaKunci: ['A', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Tinggi tiang bendera di sekolah adalah $8\\text{ meter}$.' },
      { id: 'B', label: 'B', teks: 'Jarak rumah Budi ke sekolah adalah $30\\text{ milimeter}$.' },
      { id: 'C', label: 'C', teks: 'Lebar buku tulis ini sekitar $20\\text{ centimeter}$.' },
    ],
    pembahasan: `• Tinggi tiang bendera sekolah wajarnya sekitar $6 - 10\\text{ meter}$ ($8\\text{ m}$ masuk akal $\\implies$ Benar).
• $30\\text{ milimeter}$ hanya sepanjang $3\\text{ cm}$ (sekitar seujung jari), mustahil merupakan jarak rumah ke sekolah (Salah).
• Lebar buku tulis standar sekitar $15 - 21\\text{ cm}$ ($20\\text{ cm}$ masuk akal $\\implies$ Benar).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:16:00Z',
    updatedAt: '2026-02-01T08:16:00Z',
  },
  // MTK 17: PILGAN (Volume Cairan Botol A-D)
  {
    id: 'mtk-17',
    mapelId: 'matematika',
    topik: 'Pengukuran Volume',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Empat botol berukuran sama diisi cairan berwarna dengan volume masing-masing: Botol A berisi $450\\text{ ml}$, Botol B berisi $530\\text{ ml}$, Botol C berisi $540\\text{ ml}$, dan Botol D berisi $470\\text{ ml}$. Manakah gambar yang paling tepat menunjukkan ketinggian cairan keempat botol tersebut?',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: 'Pilihan Gambar A', gambarUrl: '/assets/math_tka/q17_optA.png' },
      { label: 'B', teks: 'Pilihan Gambar B', gambarUrl: '/assets/math_tka/q17_optB.png' },
      { label: 'C', teks: 'Pilihan Gambar C', gambarUrl: '/assets/math_tka/q17_optC.png' },
      { label: 'D', teks: 'Pilihan Gambar D', gambarUrl: '/assets/math_tka/q17_optD.png' },
    ],
    pembahasan: `Urutan volume air dari yang paling sedikit hingga paling banyak adalah:
$450\\text{ ml}$ (Botol A) $< 470\\text{ ml}$ (Botol D) $< 530\\text{ ml}$ (Botol B) $< 540\\text{ ml}$ (Botol C).
Hanya Pilihan Gambar B yang menampilkan ketinggian cairan dengan urutan $A < D < B < C$ secara tepat.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:17:00Z',
    updatedAt: '2026-02-01T08:17:00Z',
  },
  // MTK 18: KATEGORI (Pengukuran Berat & Neraca Bahan Cireng)
  {
    id: 'mtk-18',
    mapelId: 'matematika',
    topik: 'Pengukuran Berat & Kesetaraan Massa',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: 'Perhatikan daftar berat bahan untuk membuat cireng pada gambar di bawah ini! Tentukan Benar atau Salah posisi timbangan (neraca) pada setiap gambar berikut!',
    gambarUrl: '/assets/math_tka/q18_bahan_cireng.png',
    gambarAlt: 'Daftar berat bahan membuat cireng: tapioka 1.250 g, terigu 500 g, ayam suwir 1.500 g, bawang putih 250 g, cabai 250 g',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      {
        id: 'mtk18-stmt-1',
        teks: 'Neraca 1 (Bawang putih dan Cabai rawit)',
        gambarUrl: '/assets/math_tka/q18_neraca1.png',
        kunciJawaban: 'Benar',
      },
      {
        id: 'mtk18-stmt-2',
        teks: 'Neraca 2 (Tepung terigu dan Ayam suwir)',
        gambarUrl: '/assets/math_tka/q18_neraca2.png',
        kunciJawaban: 'Salah',
      },
      {
        id: 'mtk18-stmt-3',
        teks: 'Neraca 3 (Tepung terigu dan Tepung tapioka)',
        gambarUrl: '/assets/math_tka/q18_neraca3.png',
        kunciJawaban: 'Benar',
      },
    ],
    pembahasan: `Bandingkan berat kedua sisi timbangan (benda yang lebih berat posisinya turun):
1) Neraca 1: Bawang putih ($250\\text{ g}$) = Cabai rawit ($250\\text{ g}$), neraca seimbang datar. (Benar)
2) Neraca 2: Tepung terigu ($500\\text{ g}$) lebih ringan daripada Ayam suwir ($1.500\\text{ g}$), seharusnya sisi kanan turun bukan sisi kiri. (Salah)
3) Neraca 3: Tepung terigu ($500\\text{ g}$) lebih ringan daripada Tepung tapioka ($1.250\\text{ g}$), sisi kanan (tapioka) turun. (Benar)`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:18:00Z',
    updatedAt: '2026-02-01T08:18:00Z',
  },
  // MTK 19: PILGAN (Pengukuran Waktu - Jam Memasak)
  {
    id: 'mtk-19',
    mapelId: 'matematika',
    topik: 'Pengukuran Waktu',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Perhatikan gambar dua jam analog yang menunjukkan waktu Ibu mulai memasak hingga selesai memasak berikut. Berapa lama waktu yang digunakan Ibu untuk memasak?',
    gambarUrl: '/assets/math_tka/q19_jam_memasak.png',
    gambarAlt: 'Jam mulai memasak pukul 08.15 dan selesai pukul 10.25',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: '$2$ jam $10$ menit.' },
      { label: 'B', teks: '$2$ jam $15$ menit.' },
      { label: 'C', teks: '$1$ jam $50$ menit.' },
      { label: 'D', teks: '$1$ jam $10$ menit.' },
    ],
    pembahasan: `• Jam mulai memasak $= 08.15$
• Jam selesai memasak $= 10.25$
Selisih waktu $= 10.25 - 08.15 = 2\\text{ jam } 10\\text{ menit}$ (Opsi A).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:19:00Z',
    updatedAt: '2026-02-01T08:19:00Z',
  },
  // MTK 20: PILGAN (Keliling Segi Banyak)
  {
    id: 'mtk-20',
    mapelId: 'matematika',
    topik: 'Keliling & Luas Bangun Datar',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Perhatikan gambar bangun segi banyak berikut! Jika panjang sisi datar paling atas adalah $12\\text{ cm}$ dan panjang sisi alas paling bawah adalah $20\\text{ cm}$, maka keliling bangun datar tersebut adalah...',
    gambarUrl: '/assets/math_tka/q20_keliling.png',
    gambarAlt: 'Bangun segi enam dengan panjang sisi miring sama 10 cm dan sisi tegak sama 4 cm',
    pilganKunci: 'D',
    pilganOptions: [
      { label: 'A', teks: '$46\\text{ cm}$' },
      { label: 'B', teks: '$52\\text{ cm}$' },
      { label: 'C', teks: '$56\\text{ cm}$' },
      { label: 'D', teks: '$60\\text{ cm}$' },
    ],
    pembahasan: `Tanda garis tunggal menunjukkan kedua sisi miring sama panjang ($10\\text{ cm}$), dan tanda garis ganda menunjukkan kedua sisi tegak sama panjang ($4\\text{ cm}$).
Keliling $= 12 + 10 + 10 + 4 + 4 + 20 = 60\\text{ cm}$ (Opsi D).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:20:00Z',
    updatedAt: '2026-02-01T08:20:00Z',
  },
  // MTK 21: PILGAN (Luas Gabungan Segitiga Kongruen)
  {
    id: 'mtk-21',
    mapelId: 'matematika',
    topik: 'Keliling & Luas Bangun Datar',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Bangun datar pada gambar tersusun dari gabungan beberapa segitiga kongruen (sama bentuk dan ukuran). Jika luas sebuah segitiga kecil yang diarsir adalah $16\\text{ cm}^2$, maka luas seluruh bangun tersebut adalah...',
    gambarUrl: '/assets/math_tka/q21_luas_segitiga.png',
    gambarAlt: 'Segi banyak dibentuk dari gabungan 10 segitiga kecil kongruen',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: '$144\\text{ cm}^2$' },
      { label: 'B', teks: '$160\\text{ cm}^2$' },
      { label: 'C', teks: '$176\\text{ cm}^2$' },
      { label: 'D', teks: '$192\\text{ cm}^2$' },
    ],
    pembahasan: `Dengan menarik garis pembagi sejajar sesuai ukuran segitiga kongruen (segitiga atas $+ 1$ segitiga kiri $+ 6$ segitiga pada persegi panjang tengah $+ 1$ segitiga kanan $+ 1$ segitiga bawah), seluruh bangun tepat terdiri dari $10$ segitiga kongruen.
Luas total $= 10 \\times 16\\text{ cm}^2 = 160\\text{ cm}^2$ (Opsi B).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:21:00Z',
    updatedAt: '2026-02-01T08:21:00Z',
  },
  // MTK 22: PILGAN (Luas Dua Lukisan = 4.800 cm²)
  {
    id: 'mtk-22',
    mapelId: 'matematika',
    topik: 'Keliling & Luas Bangun Datar',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Andi memiliki empat buah lukisan dengan ukuran seperti pada gambar. Andi ingin memajang dua buah lukisan di dinding ruang tamu yang luas gabungannya tepat $4.800\\text{ cm}^2$. Pasangan lukisan manakah yang harus dipilih Andi?',
    gambarUrl: '/assets/math_tka/q22_lukisan.png',
    gambarAlt: 'Empat lukisan A, B, C, D lengkap dengan ukuran panjang dan lebar',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: 'Lukisan A dan Lukisan B' },
      { label: 'B', teks: 'Lukisan C dan Lukisan D' },
      { label: 'C', teks: 'Lukisan A dan Lukisan C' },
      { label: 'D', teks: 'Lukisan B dan Lukisan D' },
    ],
    pembahasan: `Hitung luas masing-masing lukisan:
• Lukisan A $= 60 \\times 40 = 2.400\\text{ cm}^2$
• Lukisan B $= 50 \\times 50 = 2.500\\text{ cm}^2$
• Lukisan C $= 80 \\times 40 = 3.200\\text{ cm}^2$
• Lukisan D $= 40 \\times 40 = 1.600\\text{ cm}^2$

Total luas Lukisan C + Lukisan D $= 3.200 + 1.600 = 4.800\\text{ cm}^2$ (Opsi B).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:22:00Z',
    updatedAt: '2026-02-01T08:22:00Z',
  },
  // MTK 23: PILGAN (Ciri Sudut Keset Jenis 2)
  {
    id: 'mtk-23',
    mapelId: 'matematika',
    topik: 'Ciri & Sifat Bangun Datar',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Ibu ingin memasang hiasan pada setiap titik sudut Keset Jenis 2 seperti pada gambar. Banyak hiasan sudut yang dibutuhkan Ibu adalah...',
    gambarUrl: '/assets/math_tka/q23_keset.png',
    gambarAlt: 'Tiga jenis keset: Jenis 1 bulat, Jenis 2 persegi panjang 60x40 cm, Jenis 3 heksagonal',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: '$2$ hiasan' },
      { label: 'B', teks: '$4$ hiasan' },
      { label: 'C', teks: '$6$ hiasan' },
      { label: 'D', teks: '$8$ hiasan' },
    ],
    pembahasan: `Keset Jenis 2 berbentuk persegi panjang (memiliki panjang $60\\text{ cm}$ dan lebar $40\\text{ cm}$).
Bangun persegi panjang memiliki tepat $4$ titik sudut siku-siku, sehingga dibutuhkan $4$ hiasan sudut.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:23:00Z',
    updatedAt: '2026-02-01T08:23:00Z',
  },
  // MTK 24: KATEGORI (Kapasitas Paket Berat Keset)
  {
    id: 'mtk-24',
    mapelId: 'matematika',
    topik: 'Pengukuran Berat & Kesetaraan Massa',
    tingkatKesulitan: 'sulit',
    modelSoal: 'kategori',
    teksSoal: 'Perhatikan berat ketiga jenis keset pada gambar (Jenis 1 $= 800\\text{ gram}$, Jenis 2 $= 1.200\\text{ gram}$, Jenis 3 $= 1.500\\text{ gram}$). Sebuah paket pengiriman hanya mampu menampung berat maksimal $10\\text{ kg}$ ($10.000\\text{ gram}$) dan harus berisi minimal $2$ jenis keset yang berbeda. Tentukan Benar atau Salah pernyataan berikut mengenai jumlah maksimal keset yang dapat dimasukkan ke dalam satu paket!',
    gambarUrl: '/assets/math_tka/q23_keset.png',
    gambarAlt: 'Berat keset Jenis 1 (800 g), Jenis 2 (1.200 g), Jenis 3 (1.500 g)',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'mtk24-stmt-1', teks: '$12$ buah keset.', kunciJawaban: 'Benar' },
      { id: 'mtk24-stmt-2', teks: '$7$ buah keset.', kunciJawaban: 'Salah' },
      { id: 'mtk24-stmt-3', teks: '$6$ buah keset.', kunciJawaban: 'Salah' },
    ],
    pembahasan: `Untuk memaksimalkan banyaknya keset dalam batas $10\\text{ kg} = 10.000\\text{ gram}$ dengan minimal $2$ jenis berbeda, pilih sebanyak mungkin keset paling ringan (Jenis 1 $= 800\\text{ g}$) dicampur dengan $1$ keset teringan berikutnya (Jenis 2 $= 1.200\\text{ g}$):
• $11 \\times 800\\text{ g} + 1 \\times 1.200\\text{ g} = 8.800 + 1.200 = 10.000\\text{ gram}$ ($12$ buah keset).
• Untuk $13$ buah keset paling ringan saja butuh $12 \\times 800 + 1.200 = 10.800\\text{ g} > 10.000\\text{ g}$ (tidak muat).
Maka jumlah maksimalnya adalah tepat $12$ buah keset ($12$ Benar, sedangkan $7$ dan $6$ Salah).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:24:00Z',
    updatedAt: '2026-02-01T08:24:00Z',
  },
  // MTK 25: MCMA (Besar Sudut Gunting)
  {
    id: 'mtk-25',
    mapelId: 'matematika',
    topik: 'Pengukuran Sudut',
    tingkatKesulitan: 'mudah',
    modelSoal: 'mcma',
    teksSoal: 'Perhatikan gambar dua gunting yang terbuka. Besar sudut bukaan gunting sebelah kiri adalah $35^\\circ$, sedangkan gunting sebelah kanan terbuka lebih lebar. Berapakah perkiraan besar sudut bukaan gunting sebelah kanan? (Pilih semua jawaban yang benar)',
    gambarUrl: '/assets/math_tka/q25_gunting.png',
    gambarAlt: 'Gunting kiri bersudut 35 derajat dan gunting kanan terbuka lebih lebar',
    mcmaKunci: ['B', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: '$29^\\circ$' },
      { id: 'B', label: 'B', teks: '$51^\\circ$' },
      { id: 'C', label: 'C', teks: '$63^\\circ$' },
    ],
    pembahasan: `Karena bilah gunting sebelah kanan terbuka lebih lebar daripada $35^\\circ$ (tetapi masih merupakan sudut lancip $< 90^\\circ$), maka besar sudutnya harus lebih dari $35^\\circ$.
Opsi $51^\\circ$ (B) dan $63^\\circ$ (C) memenuhi syarat tersebut, sedangkan $29^\\circ < 35^\\circ$ tidak tepat.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:25:00Z',
    updatedAt: '2026-02-01T08:25:00Z',
  },
  // MTK 26: PILGAN (Diagram Batang Gabungan Produksi Roti)
  {
    id: 'mtk-26',
    mapelId: 'matematika',
    topik: 'Penyajian Data & Diagram Batang',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Perhatikan dua diagram batang hasil produksi roti cabang Jakarta dan cabang Tangerang dari bulan Januari hingga Mei. Manakah diagram batang yang tepat untuk menyajikan total produksi gabungan kedua cabang tersebut?',
    gambarUrl: '/assets/math_tka/q26_soal_produksi.png',
    gambarAlt: 'Diagram batang Produksi Roti Cabang Jakarta dan Cabang Tangerang',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: 'Diagram Pilihan A', gambarUrl: '/assets/math_tka/q26_optA.png' },
      { label: 'B', teks: 'Diagram Pilihan B', gambarUrl: '/assets/math_tka/q26_optB.png' },
      { label: 'C', teks: 'Diagram Pilihan C', gambarUrl: '/assets/math_tka/q26_optC.png' },
      { label: 'D', teks: 'Diagram Pilihan D', gambarUrl: '/assets/math_tka/q26_optD.png' },
    ],
    pembahasan: `Jumlahkan produksi Cabang Jakarta + Cabang Tangerang setiap bulannya:
• Januari $= 500 + 500 = 1.000$
• Februari $= 1.000 + 500 = 1.500$
• Maret $= 750 + 1.500 = 2.250$
• April $= 1.200 + 2.000 = 3.200$
• Mei $= 1.500 + 2.500 = 4.000$

Diagram batang yang menampilkan tinggi batang tepat di $1.000, 1.500, 2.250, 3.200,$ dan $4.000$ adalah Pilihan C.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:26:00Z',
    updatedAt: '2026-02-01T08:26:00Z',
  },
  // MTK 27: MCMA (Membaca Diagram Screen Time)
  {
    id: 'mtk-27',
    mapelId: 'matematika',
    topik: 'Membaca & Menafsirkan Diagram',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Diagram berikut mencatat lama penggunaan layar gawai (screen time) seorang siswa selama satu minggu. Jika ia menetapkan batas maksimal penggunaan gawai pada hari sekolah (Senin hingga Jumat) adalah total $2$ jam saja, berapa jam waktu bermain gawai yang harus dikurangi pada hari-hari sekolah? (Pilih semua jawaban yang benar)',
    gambarUrl: '/assets/math_tka/q27_screentime.png',
    gambarAlt: 'Diagram batang screen time Senin sampai Minggu',
    mcmaKunci: ['A', 'B'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: '$6$ jam' },
      { id: 'B', label: 'B', teks: '$5$ jam' },
      { id: 'C', label: 'C', teks: '$4$ jam' },
    ],
    pembahasan: `Total screen time pada hari sekolah (Senin sampai Jumat):
• Senin $= 1$ jam
• Selasa $= 0{,}5$ jam
• Rabu $= 1$ jam
• Kamis $= 2{,}5$ jam
• Jumat $= 2$ jam
Total Senin–Jumat $= 1 + 0{,}5 + 1 + 2{,}5 + 2 = 7$ jam.

Agar tidak melebihi batas maksimal $2$ jam, pengurangan minimal $= 7 - 2 = 5$ jam.
Mengurangi $5$ jam (sisa $2$ jam) maupun $6$ jam (sisa $1$ jam) keduanya memenuhi batas maksimal $\\le 2$ jam (A dan B Benar).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:27:00Z',
    updatedAt: '2026-02-01T08:27:00Z',
  },
  // MTK 28: PILGAN (Diagram Batang Pembeli Kantin)
  {
    id: 'mtk-28',
    mapelId: 'matematika',
    topik: 'Membaca & Menafsirkan Diagram',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Perhatikan diagram batang data banyak pembeli di kantin sekolah pada hari Kamis. Berapakah banyak pembeli telur gulung?',
    gambarUrl: '/assets/math_tka/q28_kantin.png',
    gambarAlt: 'Diagram batang data pembeli kantin sekolah',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: '$22$' },
      { label: 'B', teks: '$23$' },
      { label: 'C', teks: '$24$' },
      { label: 'D', teks: '$25$' },
    ],
    pembahasan: `Berdasarkan skala vertikal (selisih $2$ satuan tiap garis), tinggi batang untuk Telur Gulung berada tepat di tengah antara angka $22$ dan $24$, yaitu $23$ pembeli (Opsi B).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:28:00Z',
    updatedAt: '2026-02-01T08:28:00Z',
  },
  // MTK 29: KATEGORI (Diagram Batang Gunung Berapi & Listrik)
  {
    id: 'mtk-29',
    mapelId: 'matematika',
    topik: 'Membaca & Menafsirkan Diagram',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: 'Diagram berikut menampilkan jumlah gunung berapi di beberapa negara. Setiap gunung berapi berpotensi menghasilkan energi listrik minimal $50\\text{ MW}$ (contohnya Tonga yang memiliki $9$ gunung berapi menghasilkan minimal $450\\text{ MW}$). Tentukan Benar atau Salah pernyataan mengenai potensi minimal energi listrik negara lain berikut!',
    gambarUrl: '/assets/math_tka/q29_gunung_berapi.png',
    gambarAlt: 'Diagram batang jumlah gunung berapi di beberapa negara',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'mtk29-stmt-1', teks: 'Rusia berpotensi menghasilkan energi listrik minimal sebesar $1.350\\text{ MW}$.', kunciJawaban: 'Benar' },
      { id: 'mtk29-stmt-2', teks: 'Vanuatu memiliki potensi energi listrik yang sama besar dengan Tonga yaitu minimal $450\\text{ MW}$.', kunciJawaban: 'Benar' },
      { id: 'mtk29-stmt-3', teks: 'Papua Nugini berpotensi menghasilkan energi listrik minimal sebesar $550\\text{ MW}$.', kunciJawaban: 'Salah' },
    ],
    pembahasan: `Setiap $1$ gunung berapi menghasilkan minimal $450 : 9 = 50\\text{ MW}$.
1) Rusia memiliki $27$ gunung berapi $\\implies 27 \\times 50 = 1.350\\text{ MW}$. (Benar)
2) Vanuatu memiliki $9$ gunung berapi (sama dengan Tonga) $\\implies 9 \\times 50 = 450\\text{ MW}$. (Benar)
3) Papua Nugini memiliki $13$ gunung berapi $\\implies 13 \\times 50 = 650\\text{ MW}$, bukan $550\\text{ MW}$. (Salah)`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:29:00Z',
    updatedAt: '2026-02-01T08:29:00Z',
  },
  // MTK 30: PILGAN (Diagram Batang Peserta Karya Wisata)
  {
    id: 'mtk-30',
    mapelId: 'matematika',
    topik: 'Membaca & Menafsirkan Diagram',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Siswa kelas VI mengikuti kegiatan karya wisata menggunakan bus berkapasitas total $72$ siswa. Data banyak siswa kelas 6A dan 6B tercantum pada diagram batang berikut, sedangkan batang kelas 6C belum digambar. Jika seluruh kursi bus terisi penuh oleh siswa kelas 6A, 6B, dan 6C, maka banyaknya siswa kelas 6C adalah...',
    gambarUrl: '/assets/math_tka/q30_karya_wisata.png',
    gambarAlt: 'Diagram batang banyak siswa kelas 6A (25 siswa) dan 6B (24 siswa)',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: '$22$ siswa.' },
      { label: 'B', teks: '$23$ siswa.' },
      { label: 'C', teks: '$24$ siswa.' },
      { label: 'D', teks: '$25$ siswa.' },
    ],
    pembahasan: `Dari diagram batang:
• Siswa kelas 6A $= 25$ siswa.
• Siswa kelas 6B $= 24$ siswa.
Karena total peserta karya wisata $72$ siswa, maka banyak siswa kelas 6C $= 72 - (25 + 24) = 72 - 49 = 23$ siswa (Opsi B).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-02-01T08:30:00Z',
    updatedAt: '2026-02-01T08:30:00Z',
  },

  // ================= BAHASA INDONESIA TKA SD/MI 2026 (29 SOAL RESMI) =================
  // BIND 1: PILGAN (Wacana 1 - Bagan Hutan Mangrove)
  {
    id: 'bind-1',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-1',
    topik: 'Menyusun Ikhtisar & Bagan Isi Teks',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Bagan manakah yang sesuai untuk menggambarkan hutan mangrove pada teks?',
    pilganKunci: 'B',
    pilganOptions: [
      {
        label: 'A',
        teks: 'Bagan A (Lokasi: Kulon Progo · Zona Menarik: Ayunan · Contoh Satwa: Kepiting)',
        gambarUrl: '/assets/bind_tka_2026/q01_bagan_a.png',
      },
      {
        label: 'B',
        teks: 'Bagan B (Lokasi: Dekat Pantai Congot · Zona Menarik: Jembatan Api-Api · Contoh Satwa: Udang)',
        gambarUrl: '/assets/bind_tka_2026/q01_bagan_b.png',
      },
      {
        label: 'C',
        teks: 'Bagan C (Lokasi: Kulon Progo · Zona Menarik: Menara Pandang · Contoh Satwa: Biawak)',
        gambarUrl: '/assets/bind_tka_2026/q01_bagan_c.png',
      },
      {
        label: 'D',
        teks: 'Bagan D (Lokasi: Dekat Pantai Congot · Zona Menarik: Gazebo · Contoh Satwa: Burung Kuntul)',
        gambarUrl: '/assets/bind_tka_2026/q01_bagan_d.png',
      },
    ],
    pembahasan: `Pada paragraf pertama dijelaskan bahwa hutan mangrove terletak di dekat Pantai Congot (Kulon Progo), memiliki zona menarik seperti Pasir Mendit, Jembatan Api-Api, dan Pantai Kadilangu, serta dihuni satwa seperti burung kuntul, kepiting, udang, dan biawak kecil. Ayunan, Menara Pandang, dan Gazebo adalah spot foto (bukan zona menarik). Bagan yang tepat pada ketiga kolomnya adalah Bagan B.`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:01:00Z',
    updatedAt: '2026-02-01T09:01:00Z',
  },
  // BIND 2: MCMA (Wacana 1 - Makna Ungkapan "permata tersembunyi")
  {
    id: 'bind-2',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-1',
    topik: 'Menjelaskan Makna Ungkapan',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Apa maksud istilah "permata tersembunyi" dalam teks?',
    mcmaKunci: ['B', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Letak yang tidak mudah dijangkau, tetapi ramai dikunjungi.' },
      { id: 'B', label: 'B', teks: 'Tempat yang indah, tetapi belum dikenal banyak orang.' },
      { id: 'C', label: 'C', teks: 'Lokasi yang jarang diketahui, tetapi memiliki banyak spot menarik.' },
    ],
    pembahasan: `Ungkapan "permata tersembunyi" (hidden gem) berarti tempat yang sangat indah dan punya banyak daya tarik atau spot foto menarik (C), namun belum banyak diketahui atau dikenal orang luas (B).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:02:00Z',
    updatedAt: '2026-02-01T09:02:00Z',
  },
  // BIND 3: KATEGORI (Wacana 1 - Kesesuaian Judul dengan Isi Teks)
  {
    id: 'bind-3',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-1',
    topik: 'Kesesuaian Judul dengan Isi Teks',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: `Amara : "Menurutku, judul Indahnya Hutan-Hutan Mangrove di Indonesia kurang tepat. Teksnya hanya fokus membahas hutan mangrove di Kulon Progo, bukan seluruh Indonesia."
Bima : "Setuju. Kalau mau pakai judul itu, isi teks seharusnya membahas beberapa hutan mangrove di daerah lain juga. Bukan satu tempat saja."
Jena : "Tapi, judul itu menurutku masih cocok, kok. Soalnya, Hutan Kulon Progo juga bagian dari hutan-hutan mangrove di Indonesia. Jadi, tetap mewakili."

Pendapat siapa yang tepat dalam menggambarkan kesesuaian judul dengan isi teks tersebut?`,
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'b3-stmt-1', teks: 'Amara karena isi teks hanya fokus membahas Hutan Mangrove Kulon Progo.', kunciJawaban: 'Benar' },
      { id: 'b3-stmt-2', teks: 'Bima karena judul lebih cocok jika membahas beberapa hutan mangrove lain juga.', kunciJawaban: 'Benar' },
      { id: 'b3-stmt-3', teks: 'Jena karena Hutan Kulon Progo dapat mewakili seluruh hutan mangrove di Indonesia.', kunciJawaban: 'Salah' },
    ],
    pembahasan: `Judul "Indahnya Hutan-Hutan Mangrove di Indonesia" bermakna jamak dan luas, padahal isi teks hanya membahas satu lokasi saja yakni Hutan Mangrove Kulon Progo. Pendapat Amara (Benar) dan Bima (Benar) tepat menilai ketidaksesuaian cakupan judul, sedangkan pendapat Jena kurang tepat karena satu tempat belum mewakili seluruh hutan mangrove di Indonesia (Salah).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:03:00Z',
    updatedAt: '2026-02-01T09:03:00Z',
  },
  // BIND 4: MCMA (Wacana 2 - Keunikan Bakwan)
  {
    id: 'bind-4',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-2',
    topik: 'Menyusun Kesimpulan & Relevansi Isi Teks',
    tingkatKesulitan: 'mudah',
    modelSoal: 'mcma',
    teksSoal: 'Mengapa bakwan dikatakan sebagai makanan yang unik?',
    gambarUrl: '/assets/bind_tka_2026/q04_bakwan.png',
    gambarAlt: 'Foto makanan bakwan goreng renyah dengan cabai rawit',
    mcmaKunci: ['B', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Memiliki isi yang sama dengan makanan Jepang.' },
      { id: 'B', label: 'B', teks: 'Perkembangannya dipengaruhi budaya negara lain.' },
      { id: 'C', label: 'C', teks: 'Ditemukan di berbagai daerah dengan sebutan berbeda.' },
    ],
    pembahasan: `Teks menjelaskan bahwa bakwan muncul karena pengaruh berbagai budaya asing seperti Cina, Jepang, dan Eropa/Portugis (B), serta memiliki nama berbeda di berbagai daerah seperti ote-ote, weci, bala-bala, dan badak (C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:04:00Z',
    updatedAt: '2026-02-01T09:04:00Z',
  },
  // BIND 5: KATEGORI (Wacana 2 - Perbedaan Bakwan Sebelum dan Sesudah)
  {
    id: 'bind-5',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-2',
    topik: 'Menyimpulkan Perubahan Informasi dalam Teks',
    tingkatKesulitan: 'mudah',
    modelSoal: 'kategori',
    teksSoal: 'Apa perbedaan bakwan sebelum dan sesudah terpengaruh budaya Jepang?',
    gambarUrl: '/assets/bind_tka_2026/q04_bakwan.png',
    gambarAlt: 'Foto makanan bakwan goreng renyah dengan cabai rawit',
    kategoriLabels: ['Sebelum', 'Sesudah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'b5-stmt-1', teks: 'Berisi aneka sayuran.', kunciJawaban: 'Sesudah' },
      { id: 'b5-stmt-2', teks: 'Isi hanya daging.', kunciJawaban: 'Sebelum' },
      { id: 'b5-stmt-3', teks: 'Isinya ditambahkan udang', kunciJawaban: 'Sesudah' },
    ],
    pembahasan: `Awalnya (sebelum pengaruh tempura Jepang), bakwan terbuat dari daging dan tepung goreng. Setelah berkembang bersama pengaruh sayur goreng tepung Jepang, kini bakwan berisi aneka sayuran (taoge, kol, wortel) serta bisa ditambahkan udang, sosis, atau bakso.`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:05:00Z',
    updatedAt: '2026-02-01T09:05:00Z',
  },
  // BIND 6: MCMA (Wacana 3 - Nilai Moral Si Biru Kesayangan)
  {
    id: 'bind-6',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-3',
    topik: 'Menyimpulkan Nilai-Nilai dalam Teks',
    tingkatKesulitan: 'mudah',
    modelSoal: 'mcma',
    teksSoal: 'Nilai moral apa saja yang diperoleh dari cerita tersebut?',
    mcmaKunci: ['B', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Bebas memilih gaya hidup.' },
      { id: 'B', label: 'B', teks: 'Peduli lingkungan itu penting.' },
      { id: 'C', label: 'C', teks: 'Hal kecil bisa jadi langkah baik.' },
    ],
    pembahasan: `Dialog Salma menekankan pentingnya kepedulian terhadap lingkungan akibat sampah plastik (B) dan mengajak memulai aksi dari hal kecil seperti membawa botol minum sendiri (C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:06:00Z',
    updatedAt: '2026-02-01T09:06:00Z',
  },
  // BIND 7: PILGAN (Wacana 3 - Makna Ungkapan Tutup Mata)
  {
    id: 'bind-7',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-3',
    topik: 'Menjelaskan Makna Ungkapan/Idiom',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Makna ungkapan *tutup mata* berdasarkan dialog yang diucapkan Salma dalam wacana tersebut adalah ....',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: 'mengabaikan masalah sampah di sekitar' },
      { label: 'B', teks: 'melupakan berbagai isu lingkungan' },
      { label: 'C', teks: 'menumpuk plastik sisa pakai' },
      { label: 'D', teks: 'meningkatkan kasus pencemaran tanah' },
    ],
    pembahasan: `Pada kalimat "Kita nggak bisa terus tutup mata soal sampah plastik. Kita harus peduli.", ungkapan "tutup mata" bermakna sengaja tidak mau tahu atau mengabaikan masalah sampah di sekitar (Opsi A).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:07:00Z',
    updatedAt: '2026-02-01T09:07:00Z',
  },
  // BIND 8: KATEGORI (Wacana 3 - Refleksi Aksi Rania)
  {
    id: 'bind-8',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-3',
    topik: 'Merefleksikan Peristiwa dalam Kehidupan Sehari-hari',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: `Rania telah membaca cerita *Si Biru Kesayangan*. Ia tersadar untuk memulai aksi peduli lingkungan seperti Alvin.
Apa yang sebaiknya Rania lakukan untuk memulai aksinya berdasarkan cerita tersebut?`,
    kategoriLabels: ['Sesuai', 'Tidak Sesuai'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'b8-stmt-1', teks: 'Menggunakan botol minum isi ulang setiap hari.', kunciJawaban: 'Sesuai' },
      { id: 'b8-stmt-2', teks: 'Membeli botol minum isi ulang untuk teman-temannya.', kunciJawaban: 'Tidak Sesuai' },
      { id: 'b8-stmt-3', teks: 'Mengajak teman-teman membatasi pembelian minuman kemasan.', kunciJawaban: 'Sesuai' },
    ],
    pembahasan: `Aksi yang dicontohkan dalam cerita adalah membawa botol minum sendiri setiap hari (Sesuai) dan mengedukasi/mengajak teman agar tidak membeli minuman kemasan sekali pakai (Sesuai), bukan membelikan botol untuk semua teman (Tidak Sesuai).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:08:00Z',
    updatedAt: '2026-02-01T09:08:00Z',
  },
  // BIND 9: PILGAN (Wacana 4 - Mengapa Hujan Meteor Tidak Berbahaya)
  {
    id: 'bind-9',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-4',
    topik: 'Mengidentifikasi Informasi Tersurat',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Mengapa hujan meteor tidak berbahaya?',
    gambarUrl: '/assets/bind_tka_2026/q09_meteor.png',
    gambarAlt: 'Ilustrasi anak dan ayah memandangi hujan meteor di langit malam',
    pilganKunci: 'D',
    pilganOptions: [
      { label: 'A', teks: 'Meteor dapat berpindah.' },
      { label: 'B', teks: 'Hanya muncul saat langit cerah.' },
      { label: 'C', teks: 'Hanya muncul saat hujan.' },
      { label: 'D', teks: 'Akan habis terbakar di langit.' },
    ],
    pembahasan: `Dalam teks tertulis jelas ucapan ayah: "Hujan meteor tidak berbahaya, kok. Jangan takut, meteor ini akan habis terbakar di langit." (Opsi D).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:09:00Z',
    updatedAt: '2026-02-01T09:09:00Z',
  },
  // BIND 10: MCMA (Wacana 4 - Hal yang Membuat Tokoh "Aku" Senang)
  {
    id: 'bind-10',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-4',
    topik: 'Menyusun Inferensi & Kesimpulan',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Berdasarkan cerita di atas, hal apa saja yang dapat membuat tokoh "Aku" senang?',
    gambarUrl: '/assets/bind_tka_2026/q09_meteor.png',
    gambarAlt: 'Ilustrasi anak dan ayah memandangi hujan meteor di langit malam',
    mcmaKunci: ['A', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Menonton hujan meteor dengan ayahnya.' },
      { id: 'B', label: 'B', teks: 'Menulis buku harian sambil melihat meteor.' },
      { id: 'C', label: 'C', teks: 'Langit cerah ketika menonton hujan meteor.' },
    ],
    pembahasan: `Tokoh "Aku" menyatakan sangat senang menghabiskan waktu menonton hujan meteor bersama ayahnya (A) dan berdoa agar hari tidak hujan karena meteor terlihat jelas saat langit cerah (C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:10:00Z',
    updatedAt: '2026-02-01T09:10:00Z',
  },
  // BIND 11: PILGAN (Wacana 5 - Giga Bermain dengan Heksagonal)
  {
    id: 'bind-11',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-5',
    topik: 'Mengidentifikasi Informasi Tersurat',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Bentuk apa yang bisa ditiru Giga saat bermain dengan Heksagonal?',
    gambarUrl: '/assets/bind_tka_2026/q11_heksagonal.png',
    gambarAlt: 'Ilustrasi bentuk bunga heksagonal bersama Giga si Segitiga',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: 'Bunga.' },
      { label: 'B', teks: 'Pohon cemara.' },
      { label: 'C', teks: 'Gunung.' },
      { label: 'D', teks: 'Atap rumah.' },
    ],
    pembahasan: `Dalam teks dan gambar tertulis jelas: "Saat bermain dengan Heksagonal, dia menirukan bentuk bunga." (Opsi A).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:11:00Z',
    updatedAt: '2026-02-01T09:11:00Z',
  },
  // BIND 12: MCMA (Wacana 5 - Giga Bermain dengan Pasukan Kotak)
  {
    id: 'bind-12',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-5',
    topik: 'Mengidentifikasi Informasi Tersurat',
    tingkatKesulitan: 'mudah',
    modelSoal: 'mcma',
    teksSoal: 'Apa yang dibuat Giga saat bermain bersama pasukan kotak?',
    gambarUrl: '/assets/bind_tka_2026/q12_kotak.png',
    gambarAlt: 'Ilustrasi bentuk menara jam dan roket bersama Pasukan Kotak',
    mcmaKunci: ['A', 'B'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Roket.' },
      { id: 'B', label: 'B', teks: 'Menara.' },
      { id: 'C', label: 'C', teks: 'Bendera.' },
    ],
    pembahasan: `Pada cerita disebutkan: "Giga juga suka bermain dengan Pasukan Kotak. Banyak bentuk yang bisa ditirukan, seperti roket, ikan, dan menara." (Opsi A dan B; bendera adalah bentuk bersama sesama segitiga).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:12:00Z',
    updatedAt: '2026-02-01T09:12:00Z',
  },
  // BIND 13: PILGAN (Wacana 6 - Cara Pergi Pertama Kali ke Pulau Kemaro)
  {
    id: 'bind-13',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-6',
    topik: 'Mengidentifikasi Informasi Tersurat',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Bagaimana cara Keluarga Adit dan Danu pergi ke Pulau Kemaro saat pertama kalinya?',
    gambarUrl: '/assets/bind_tka_2026/q13_capgomeh.png',
    gambarAlt: 'Ilustrasi keluarga Adit dan Danu berbaju merah menyaksikan pagoda perayaan Cap Go Meh',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: 'Menyeberangi jembatan ponton dengan mobil.' },
      { label: 'B', teks: 'Melewati jembatan ponton dengan berjalan kaki.' },
      { label: 'C', teks: 'Menggunakan kapal dari bawah jembatan Musi.' },
      { label: 'D', teks: 'Melewati jembatan Musi dengan berjalan kaki.' },
    ],
    pembahasan: `Paragraf kedua menjelaskan bahwa pada kunjungan pertama kalinya, mereka naik kapal dari bawah jembatan Musi, sedangkan kali kedua baru berjalan kaki melewati jembatan ponton. (Opsi C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:13:00Z',
    updatedAt: '2026-02-01T09:13:00Z',
  },
  // BIND 14: MCMA (Wacana 6 - Unsur Intrinsik & Rasa Syukur)
  {
    id: 'bind-14',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-6',
    topik: 'Menyusun Kesimpulan Unsur Intrinsik',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Apa peristiwa yang membuat Danu dan Adit berpikir bahwa bersyukur adalah hal yang penting di dalam hidup mereka?',
    gambarUrl: '/assets/bind_tka_2026/q13_capgomeh.png',
    gambarAlt: 'Ilustrasi keluarga Adit dan Danu berbaju merah menyaksikan pagoda perayaan Cap Go Meh',
    mcmaKunci: ['A', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Pertunjukan barongsai ditiadakan sehingga mereka memilih berkeliling pulau.' },
      { id: 'B', label: 'B', teks: 'Keluarga Danu berjalan kaki melewati jembatan Ponton meskipun hujan turun.' },
      { id: 'C', label: 'C', teks: 'Penerbangan lampion dihilangkan, mereka memilih makan makanan khas imlek.' },
    ],
    pembahasan: `Karena hujan deras, pertunjukan barongsai dan penerbangan lampion dibatalkan. Namun Adit dan Danu tetap bersyukur dengan menikmati perayaan melalui berkeliling pulau (A) dan mencoba makanan khas Imlek (C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:14:00Z',
    updatedAt: '2026-02-01T09:14:00Z',
  },
  // BIND 15: PILGAN (Wacana 6 - Refleksi Kejadian dalam Kehidupan)
  {
    id: 'bind-15',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-6',
    topik: 'Merefleksikan Pengetahuan Baru dalam Kehidupan',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Berdasarkan cerita, apa yang akan kamu lakukan jika rencana berlibur ke pantai batal akibat hujan?',
    gambarUrl: '/assets/bind_tka_2026/q13_capgomeh.png',
    gambarAlt: 'Ilustrasi keluarga Adit dan Danu berbaju merah menyaksikan pagoda perayaan Cap Go Meh',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: 'Berlapang dada dan memilih untuk menyusun rencana menyenangkan lain di rumah.' },
      { label: 'B', teks: 'Merasa sedih sehingga memilih untuk melihat hujan dari jendela berharap hujan segera reda.' },
      { label: 'C', teks: 'Bersikap biasa-biasa saja dan memilih untuk berdiam diri di rumah tanpa aktivitas apapun.' },
      { label: 'D', teks: 'Memilih untuk melanjutkan tidur sembari berharap hujan bisa reda ketika sudah bangun nantinya.' },
    ],
    pembahasan: `Pesan cerita adalah tetap bersyukur dan mencari cara positif menikmati suasana meski rencana awal batal akibat hujan, yaitu berlapang dada dan menyusun rencana menyenangkan lain di rumah (Opsi A).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:15:00Z',
    updatedAt: '2026-02-01T09:15:00Z',
  },
  // BIND 16: PILGAN (Wacana 7 - Fokus Utama Kota Berkelanjutan)
  {
    id: 'bind-16',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-7',
    topik: 'Menjelaskan Ide Pokok / Fokus Utama Teks',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Apa yang menjadi fokus utama dalam teks tersebut?',
    gambarUrl: '/assets/bind_tka_2026/q16_kota.png',
    gambarAlt: 'Ilustrasi perkotaan dengan gedung tinggi, pepohonan, bangku taman, dan zebra cross',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: 'Manfaat menggunakan kendaraan tenaga listrik.' },
      { label: 'B', teks: 'Pentingnya kota berkelanjutan untuk masa depan.' },
      { label: 'C', teks: 'Fasilitas publik yang tersedia di kota berkelanjutan.' },
      { label: 'D', teks: 'Cara pengolahan sampah di kota berkelanjutan.' },
    ],
    pembahasan: `Keseluruhan teks membahas upaya membangun kota berkelanjutan beserta ciri-ciri kenyamanan, energi bersih, transportasi, dan pengelolaannya demi mengatasi masalah iklim dan menjaga masa depan (Opsi B).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:16:00Z',
    updatedAt: '2026-02-01T09:16:00Z',
  },
  // BIND 17: PILGAN (Wacana 7 - Dampak Pengolahan Sampah yang Baik)
  {
    id: 'bind-17',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-7',
    topik: 'Menyimpulkan Isi & Substansi Teks',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Hasil apa yang diharapkan dari sistem pengolahan sampah yang baik?',
    gambarUrl: '/assets/bind_tka_2026/q16_kota.png',
    gambarAlt: 'Ilustrasi perkotaan dengan gedung tinggi, pepohonan, bangku taman, dan zebra cross',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: 'Kota menjadi bersih.' },
      { label: 'B', teks: 'Air menjadi melimpah.' },
      { label: 'C', teks: 'Udara menjadi sejuk.' },
      { label: 'D', teks: 'Waktu menjadi efisien.' },
    ],
    pembahasan: `Pengelolaan sampah yang baik termasuk daur ulang bertujuan agar lingkungan kota bebas tumpukan limbah dan menjadi bersih, sehat, serta nyaman (Opsi A).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:17:00Z',
    updatedAt: '2026-02-01T09:17:00Z',
  },
  // BIND 18: MCMA (Wacana 7 - Kesesuaian Ilustrasi dengan Isi Teks)
  {
    id: 'bind-18',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-7',
    topik: 'Menilai Kesesuaian Ilustrasi dengan Isi Teks',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Berdasarkan isi teks, mengapa ciri-ciri kota berkelanjutan belum nampak dalam gambar?',
    gambarUrl: '/assets/bind_tka_2026/q16_kota.png',
    gambarAlt: 'Ilustrasi perkotaan dengan gedung tinggi, pepohonan, bangku taman, dan zebra cross',
    mcmaKunci: ['B', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Tidak ada gambar ruang terbuka hijau seperti taman dan lapangan.' },
      { id: 'B', label: 'B', teks: 'Tidak ada gambar alat transportasi ramah lingkungan bertenaga listrik.' },
      { id: 'C', label: 'C', teks: 'Tidak ada gambar manusia yang sedang melakukan aktivitas di jalan.' },
    ],
    pembahasan: `Pada gambar terlihat pepohonan hijau dan bangku taman di sepanjang trotoar (sehingga opsi A keliru), namun jalan raya tampak kosong tanpa transportasi publik/listrik (B) serta tidak tampak pejalan kaki/pesepeda atau aktivitas manusia (C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:18:00Z',
    updatedAt: '2026-02-01T09:18:00Z',
  },
  // BIND 19: PILGAN (Wacana 8 - Pemotong Rambut Rara)
  {
    id: 'bind-19',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-8',
    topik: 'Mengidentifikasi Informasi Tersurat',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Siapa yang memotong rambut Rara saat ruwatan?',
    gambarUrl: '/assets/bind_tka_2026/q19_ruwatan.png',
    gambarAlt: 'Ilustrasi Rara berambut gimbal bersama ibu, ayah, dan ketua adat saat tradisi ruwatan',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: 'Ketua adat' },
      { label: 'B', teks: 'Ibu Rara' },
      { label: 'C', teks: 'Ayah Rara' },
      { label: 'D', teks: 'Tukang cukur' },
    ],
    pembahasan: `Dalam cerita dijelaskan oleh Ibu: "Di sana Ketua adat akan memotong rambut gimbal Rara." (Opsi A).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:19:00Z',
    updatedAt: '2026-02-01T09:19:00Z',
  },
  // BIND 20: PILGAN (Wacana 8 - Perasaan Rara)
  {
    id: 'bind-20',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-8',
    topik: 'Menyimpulkan Perasaan & Sifat Tokoh',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Bagaimana perasaan Rara setelah mendengar penjelasan Ayah?',
    gambarUrl: '/assets/bind_tka_2026/q19_ruwatan.png',
    gambarAlt: 'Ilustrasi Rara berambut gimbal bersama ibu, ayah, dan ketua adat saat tradisi ruwatan',
    pilganKunci: 'D',
    pilganOptions: [
      { label: 'A', teks: 'Lega.' },
      { label: 'B', teks: 'Puas.' },
      { label: 'C', teks: 'Ceria.' },
      { label: 'D', teks: 'Ikhlas.' },
    ],
    pembahasan: `Setelah mendengar kondisi pekerjaan orang tuanya, Rara sadar, meminta maaf, dan mengganti permintaannya menjadi buku cerita di pasar tanpa memaksa lagi. Sikap menerima keadaan dengan rela tersebut menunjukkan perasaan ikhlas (Opsi D).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:20:00Z',
    updatedAt: '2026-02-01T09:20:00Z',
  },
  // BIND 21: MCMA (Wacana 8 - Refleksi Meminta Barang pada Orang Tua)
  {
    id: 'bind-21',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-8',
    topik: 'Merefleksikan Pengetahuan Baru dalam Kehidupan',
    tingkatKesulitan: 'mudah',
    modelSoal: 'mcma',
    teksSoal: 'Sebelumnya kamu suka memaksa minta barang yang kamu inginkan kepada orang tua. Setelah membaca cerita tersebut, apa yang sebaiknya kamu lakukan jika suatu hari kamu ingin punya barang baru?',
    gambarUrl: '/assets/bind_tka_2026/q19_ruwatan.png',
    gambarAlt: 'Ilustrasi Rara berambut gimbal bersama ibu, ayah, dan ketua adat saat tradisi ruwatan',
    mcmaKunci: ['A', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Bertanya kepada ayah dan ibu apakah punya uang atau tidak.' },
      { id: 'B', label: 'B', teks: 'Meminta ayah dan ibu langsung membelikan barang itu.' },
      { id: 'C', label: 'C', teks: 'Memikirkan apakah barang itu perlu atau tidak dimiliki saat ini.' },
    ],
    pembahasan: `Keteladanan Rara mengajarkan untuk mempertimbangkan kemampuan ekonomi orang tua (A) serta menimbang kebutuhan barang sebelum meminta (C), bukan memaksa langsung dibelikan (B).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:21:00Z',
    updatedAt: '2026-02-01T09:21:00Z',
  },
  // BIND 22: PILGAN (Wacana 9 - Maksud Peribahasa Erni)
  {
    id: 'bind-22',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-9',
    topik: 'Menentukan Makna Ungkapan/Peribahasa',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: `Dalam cerita tersebut, Erni mengatakan "bersakit-sakit dahulu, bersenang-senang kemudian".
Apa maksud Erni saat mengatakan itu?`,
    gambarUrl: '/assets/bind_tka_2026/q22_nilai40.png',
    gambarAlt: 'Ilustrasi lembar ujian bertuliskan nilai 40 berwarna merah',
    pilganKunci: 'D',
    pilganOptions: [
      { label: 'A', teks: 'Menginformasikan kepada Arul bahwa ia harus lebih giat dan semangat lagi dalam belajar.' },
      { label: 'B', teks: 'Memperjelas ucapan Erni bahwa Arul bisa mendapatkan nilai yang bagus kalau belajar bersama.' },
      { label: 'C', teks: 'Menasihati Arul bahwa ia bisa mendapatkan nilai yang bagus kalau dia tidak sombong.' },
      { label: 'D', teks: 'Memberitahukan kepada Arul bahwa ia harus mau belajar kalau ingin nilai ujiannya bagus lagi.' },
    ],
    pembahasan: `Ucapan Erni merespons kalimat Dewi ("Kamu harus belajar kalau mau nilai bagus") dan keluhan Arul yang nilainya turun drastis (40). Peribahasa tersebut bermaksud memberitahukan Arul bahwa ia harus mau bersusah-payah belajar terlebih dahulu apabila ingin nilai ujiannya bagus lagi (Opsi D).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:22:00Z',
    updatedAt: '2026-02-01T09:22:00Z',
  },
  // BIND 23: PILGAN (Wacana 9 - Perubahan Sikap Arul)
  {
    id: 'bind-23',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-9',
    topik: 'Menyimpulkan Perubahan Karakter/Watak Tokoh',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Bagaimana perubahan sikap Arul setelah menyadari nilainya jelek?',
    gambarUrl: '/assets/bind_tka_2026/q22_nilai40.png',
    gambarAlt: 'Ilustrasi lembar ujian bertuliskan nilai 40 berwarna merah',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: 'Arul menjadi lebih giat untuk belajar sendiri di rumah.' },
      { label: 'B', teks: 'Arul berjanji belajar lebih giat kepada teman-temannya.' },
      { label: 'C', teks: 'Arul akhirnya mau belajar bersama teman-temannya.' },
      { label: 'D', teks: 'Arul merasa akan lebih mudah dalam ujian jika dia belajar.' },
    ],
    pembahasan: `Pada akhir dialog, ketika Reno mengajak "Ayo belajar bareng biar sama-sama tahu", Arul pun mengangguk tanda setuju mau belajar bersama teman-temannya (Opsi C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:23:00Z',
    updatedAt: '2026-02-01T09:23:00Z',
  },
  // BIND 24: KATEGORI (Wacana 9 - Refleksi Nilai Keteladanan Riza)
  {
    id: 'bind-24',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-9',
    topik: 'Merefleksikan Nilai-Nilai Keteladanan',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: `Setelah membaca cerita tersebut, Riza merasa bahwa dirinya memiliki kesamaan dengan Arul yang sama-sama nilainya semakin memburuk.
Apa yang bisa dilakukan Riza agar nilainya bisa bagus berdasarkan pengalaman cerita Arul?`,
    gambarUrl: '/assets/bind_tka_2026/q22_nilai40.png',
    gambarAlt: 'Ilustrasi lembar ujian bertuliskan nilai 40 berwarna merah',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'b24-stmt-1', teks: 'Belajar kelompok bersama teman-teman agar ada yang mengajari materi sulit.', kunciJawaban: 'Benar' },
      { id: 'b24-stmt-2', teks: 'Meyakini kemampuan diri dan tetap menjalankan hobi bermain sepak bola di lapangan.', kunciJawaban: 'Salah' },
      { id: 'b24-stmt-3', teks: 'Bertanya ketika guru menjelaskan pelajaran agar lebih yakin menjawab pertanyaan saat ujian.', kunciJawaban: 'Benar' },
    ],
    pembahasan: `Agar nilai membaik seperti pelajaran yang dipetik Arul, Riza perlu belajar kelompok bersama teman (Benar) dan aktif bertanya saat pelajaran berlangsung (Benar), bukan tetap bermalas-malasan bermain bola tanpa belajar (Salah).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:24:00Z',
    updatedAt: '2026-02-01T09:24:00Z',
  },
  // BIND 25: PILGAN (Wacana 10 / PDF Indikator 26 - Perubahan Sikap Kamal)
  {
    id: 'bind-25',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-10',
    topik: 'Menyimpulkan Perubahan Karakter Tokoh',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Bagaimana sikap Kamal setelah ia mendapat teguran dan dipaksa ikut melaut dengan Yunus?',
    gambarUrl: '/assets/bind_tka_2026/q26_nelayan.png',
    gambarAlt: 'Ilustrasi para nelayan melaut dengan perahu dan jala di laut senja berburung camar',
    pilganKunci: 'A',
    pilganOptions: [
      { label: 'A', teks: 'Tersadar untuk rajin melaut setiap hari.' },
      { label: 'B', teks: 'Bersemangat melaut bersama para warga.' },
      { label: 'C', teks: 'Tergerak untuk serius memperbaiki kapal.' },
      { label: 'D', teks: 'Berusaha keras membuktikan pada warga.' },
    ],
    pembahasan: `Dua kalimat terakhir cerita menyatakan bahwa setelah diajak melaut setiap hari bersama Yunus, "Sekarang Kamal sudah melaut setiap hari. Kamal bahkan melaut dengan perahunya sendiri." Ini menunjukkan ia tersadar untuk rajin melaut setiap hari (Opsi A).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:25:00Z',
    updatedAt: '2026-02-01T09:25:00Z',
  },
  // BIND 26: KATEGORI (Wacana 10 / PDF Indikator 27 - Respons Emosional Terhadap Konflik Tokoh)
  {
    id: 'bind-26',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-10',
    topik: 'Menentukan Respons Emosional terhadap Konflik Tokoh',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: `Setelah membaca cerita, Johan, Simon, dan Maria berpendapat sebagai berikut.
Simon : "Aku kagum dengan sikap Yunus yang tetap mau menemani Kamal."
Johan : "Iya, tapi Yunus terlalu sabar dengan perilaku Kamal. Itu menjengkelkan."
Maria : "Aku pun geregetan karena Kamal memang pantas ditegur dengan keras."

Pendapat siapa yang paling sesuai dengan bagian akhir cerita tersebut?`,
    gambarUrl: '/assets/bind_tka_2026/q26_nelayan.png',
    gambarAlt: 'Ilustrasi para nelayan melaut dengan perahu dan jala di laut senja berburung camar',
    kategoriLabels: ['Sesuai', 'Tidak Sesuai'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'b26-stmt-1', teks: 'Johan karena Yunus memang terlalu baik hati pada Kamal dan tetangga.', kunciJawaban: 'Tidak Sesuai' },
      { id: 'b26-stmt-2', teks: 'Simon karena Yunus mau menemani Kamal sampai terbiasa melaut sendiri.', kunciJawaban: 'Sesuai' },
      { id: 'b26-stmt-3', teks: 'Maria karena Yunus menegur keras ketika perilaku Kamal sudah kelewat batas.', kunciJawaban: 'Sesuai' },
    ],
    pembahasan: `Di bagian akhir cerita, Yunus tidak hanya berdiam sabar; ia menegur Kamal dengan tegas/keras (sejalan dengan Maria -> Sesuai) dan mengajak serta menemani Kamal melaut setiap hari hingga Kamal terbiasa melaut sendiri (sejalan dengan Simon -> Sesuai). Pendapat Johan bahwa Yunus terlalu baik hati/terlalu sabar di bagian akhir tidak tepat (Tidak Sesuai).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:26:00Z',
    updatedAt: '2026-02-01T09:26:00Z',
  },
  // BIND 27: PILGAN (Wacana 11 / PDF Indikator 28 - Tokoh yang Suka Menggambar)
  {
    id: 'bind-27',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-11',
    topik: 'Mengidentifikasi Informasi Tersurat',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Siapa yang sangat suka menggambar?',
    gambarUrl: '/assets/bind_tka_2026/q28_lianne.png',
    gambarAlt: 'Ilustrasi Mama mengangkat piala dan lukisan kemenangan lomba menggambar bersama Lianne',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: 'Albert.' },
      { label: 'B', teks: 'Giffari.' },
      { label: 'C', teks: 'Lianne.' },
      { label: 'D', teks: 'Amber.' },
    ],
    pembahasan: `Kalimat pembuka cerita menyatakan langsung: "Halo! Namaku Lianne. Aku suka sekali menggambar." (Opsi C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:27:00Z',
    updatedAt: '2026-02-01T09:27:00Z',
  },
  // BIND 28: PILGAN (Wacana 11 / PDF Indikator 29 - Sifat Tokoh Lianne)
  {
    id: 'bind-28',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-11',
    topik: 'Menyimpulkan Sifat & Karakter Tokoh',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Bagaimana sifat yang ditunjukkan Lianne pada cerita tersebut?',
    gambarUrl: '/assets/bind_tka_2026/q28_lianne.png',
    gambarAlt: 'Ilustrasi Mama mengangkat piala dan lukisan kemenangan lomba menggambar bersama Lianne',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: 'Rajin belajar, dibuktikan dengan ia yang berprestasi pada pelajaran matematika.' },
      { label: 'B', teks: 'Gemar olah raga, dibuktikan dengan ia yang rajin berlatih olah raga basket.' },
      { label: 'C', teks: 'Pantang menyerah, dibuktikan dengan ia yang terus giat mengasah bakatnya.' },
      { label: 'D', teks: 'Lapang dada, dibuktikan dengan ia yang dapat menerima kekurangan dirinya.' },
    ],
    pembahasan: `Meskipun sempat gagal dalam matematika, basket, dan menyanyi, Lianne tetap melatih kemampuan menggambarnya dengan berkeliling mencari ide menarik dan mengikuti lomba hingga menang. Hal ini membuktikan sifat pantang menyerah dalam mengasah bakatnya (Opsi C).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:28:00Z',
    updatedAt: '2026-02-01T09:28:00Z',
  },
  // BIND 29: KATEGORI (Wacana 11 / PDF Indikator 30 - Respons Emosional Terhadap Perbandingan)
  {
    id: 'bind-29',
    mapelId: 'bahasa_indonesia',
    stimulusId: 'stm-bind-11',
    topik: 'Menentukan Respons Emosional terhadap Konflik',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: `Dinda selesai membaca cerita "Mama, Aku Bukan Dia". Dinda juga tidak suka dibanding-bandingkan dengan orang lain. Ia yakin, setiap orang memiliki keunggulan yang berbeda-beda.
Apa kemungkinan yang dirasakan oleh Dinda ketika Lianne selalu dibandingkan dengan teman-temannya oleh Mamanya?`,
    gambarUrl: '/assets/bind_tka_2026/q28_lianne.png',
    gambarAlt: 'Ilustrasi Mama mengangkat piala dan lukisan kemenangan lomba menggambar bersama Lianne',
    kategoriLabels: ['Setuju', 'Tidak Setuju'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'b29-stmt-1', teks: 'Sedih, karena Lianne selalu tidak diakui keunikannya oleh mamanya.', kunciJawaban: 'Setuju' },
      { id: 'b29-stmt-2', teks: 'Marah, karena teman-temannya selalu lebih unggul darinya.', kunciJawaban: 'Tidak Setuju' },
      { id: 'b29-stmt-3', teks: 'Kecewa, karena ia tidak bisa menjadi dirinya sendiri di depan mamanya.', kunciJawaban: 'Setuju' },
    ],
    pembahasan: `Saat seorang anak terus dibanding-bandingkan, perasaan yang wajar timbul adalah sedih karena keunikannya tidak diakui (Setuju) dan kecewa karena dituntut menjadi orang lain (Setuju). Dalam cerita, Lianne justru bangga kepada prestasi temannya dan hanya kesal atas sikap pembandingan ibunya, bukan marah terhadap keunggulan teman-temannya (Tidak Setuju).`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-02-01T09:29:00Z',
    updatedAt: '2026-02-01T09:29:00Z',
  },

  // ================= IPA TERPADU (10 SOAL) =================
  // IPA 1: PILGAN (Stimulus 1 - Ekologi & Trofik)
  {
    id: 'ipa-1',
    mapelId: 'ipa',
    stimulusId: 'stm-1',
    topik: 'Ekologi & Piramida Energi',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Berdasarkan Wacana 1 dan bagan jaring-jaring makanan mangrove, organisme yang bertindak secara simultan sebagai konsumen tingkat primer (herbivor/detritivor) adalah...',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: 'Burung elang tiram (*Pandion haliaetus*)' },
      { label: 'B', teks: 'Siput mangrove, kepiting sesarmid, dan ikan belanak' },
      { label: 'C', teks: 'Ikan barakuda dan hiu banteng' },
      { label: 'D', teks: 'Pohon bakau merah (*Rhizophora mangle*)' },
    ],
    pembahasan: `Konsumen primer pada rantai makanan mangrove mengonsumsi serasah/detritus basal dari produsen. Bagan wacana 1 secara jelas meletakkan siput mangrove, kepiting sesarmid, dan ikan belanak pada Tingkat Trofik 2 (Level 2: Primary Consumers / Detritivores).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-01-22T08:00:00Z',
  },
  // IPA 2: MCMA (Stimulus 1 - Dampak Aliran Energi)
  {
    id: 'ipa-2',
    mapelId: 'ipa',
    stimulusId: 'stm-1',
    topik: 'Dinamika Populasi & Konservasi',
    tingkatKesulitan: 'sulit',
    modelSoal: 'mcma',
    teksSoal: 'Jika terjadi pencemaran limbah logam berat yang memusnahkan populasi bakteri dan fungi pengurai (dekomposer) di kawasan mangrove, dampak ekologis apa saja yang diprediksi akan terjadi? (Pilih semua opsi yang tepat)',
    mcmaKunci: ['A', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Penimbunan serasah daun mangrove tanpa terurai menjadi partikel detritus organik halus.' },
      { id: 'B', label: 'B', teks: 'Peningkatan tajam laju reproduksi zooplankton dan benih ikan.' },
      { id: 'C', label: 'C', teks: 'Kelaparan massal pada organisme detritivor yang memicu kolapsnya konsumen tingkat berikutnya.' },
      { id: 'D', label: 'D', teks: 'Hiu banteng beralih menjadi organisme fotoautotrof produsen.' },
    ],
    pembahasan: `Dekomposer berperan krusial merombak serasah menjadi detritus yang dapat dimakan detritivor. Tanpa pengurai, serasah menumpuk tanpa menjadi makanan (A) dan rantai trofik di atasnya kekurangan energi (C).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T08:15:00Z',
    updatedAt: '2026-01-22T08:15:00Z',
  },
  // IPA 3: KATEGORI (Fisika Mekanika Gerak)
  {
    id: 'ipa-3',
    mapelId: 'ipa',
    topik: 'Kinematika & Hukum Newton',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: 'Sebuah balok bermassa $m = 4\\text{ kg}$ meluncur pada bidang miring licin (tanpa gesekan) dengan sudut kemiringan $\\theta = 30^\\circ$ terhadap horizontal ($g = 10\\text{ m/s}^2$). Evaluasi pernyataan berikut:',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'ipk-1', teks: 'Komponen gaya gravitasi yang mempercepat balok menuruni bidang miring adalah $20\\text{ N}$.', kunciJawaban: 'Benar' },
      { id: 'ipk-2', teks: 'Percepatan linier balok menuruni bidang miring adalah $5\\text{ m/s}^2$.', kunciJawaban: 'Benar' },
      { id: 'ipk-3', teks: 'Gaya normal yang dialami balok bernilai sama dengan berat total balok ($40\\text{ N}$).', kunciJawaban: 'Salah' },
    ],
    pembahasan: `$w = mg = 4 \\times 10 = 40\\text{ N}$.
Komponen penarik sejajar bidang miring: $F_x = mg \\sin(30^\\circ) = 40 \\times 0.5 = 20\\text{ N}$. (Benar).
Percepatan $a = F_x / m = 20 / 4 = 5\\text{ m/s}^2$ atau $g \\sin(30^\\circ) = 10(0.5) = 5\\text{ m/s}^2$. (Benar).
Gaya normal tegak lurus bidang: $N = mg \\cos(30^\\circ) = 40 \\times \\frac{\\sqrt{3}}{2} = 20\\sqrt{3}\\text{ N} \\approx 34.6\\text{ N} \\ne 40\\text{ N}$. (Salah).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T08:30:00Z',
    updatedAt: '2026-01-22T08:30:00Z',
  },
  // IPA 4: PILGAN (Kimia Stoikiometri & Gas Ideal)
  {
    id: 'ipa-4',
    mapelId: 'ipa',
    topik: 'Stoikiometri & Hukum Gas Ideal',
    tingkatKesulitan: 'sedang',
    modelSoal: 'pilgan',
    teksSoal: 'Pada keadaan standar (STP: $0^\\circ\\text{C}, 1\\text{ atm}$), volume dari $8\\text{ gram}$ gas oksigen ($O_2$, diketahui $Ar\\ O = 16$) adalah...',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: '$2.80\\text{ liter}$' },
      { label: 'B', teks: '$5.60\\text{ liter}$' },
      { label: 'C', teks: '$11.20\\text{ liter}$' },
      { label: 'D', teks: '$22.40\\text{ liter}$' },
    ],
    pembahasan: `$Mr\\ O_2 = 2 \\times 16 = 32\\text{ g/mol}$.
Jumlah mol $n = \\frac{\\text{massa}}{Mr} = \\frac{8}{32} = 0.25\\text{ mol}$.
Pada STP, $V = n \\times 22.4\\text{ L/mol} = 0.25 \\times 22.4 = 5.60\\text{ liter}$.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T08:45:00Z',
    updatedAt: '2026-01-22T08:45:00Z',
  },
  // IPA 5: MCMA (Biologi Sel & Organel)
  {
    id: 'ipa-5',
    mapelId: 'ipa',
    topik: 'Struktur dan Fungsi Organel Sel',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Manakah dari organel sel di bawah ini yang memiliki membran ganda serta materi genetik (DNA) sirkular sendiri di dalam sitoplasmanya? (Pilih semua yang tepat)',
    mcmaKunci: ['A', 'C'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Mitokondria' },
      { id: 'B', label: 'B', teks: 'Badan Golgi (Aparatus Golgi)' },
      { id: 'C', label: 'C', teks: 'Kloroplas (pada sel tumbuhan)' },
      { id: 'D', label: 'D', teks: 'Ribosom' },
    ],
    pembahasan: `Berdasarkan teori endosimbiosis, Mitokondria dan Kloroplas adalah organel bermembran ganda yang memiliki DNA sirkular sendiri (mtDNA dan cpDNA) serta ribosom tipe 70S. Badan Golgi bermembran tunggal, dan ribosom tidak memiliki membran.`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-01-22T09:00:00Z',
  },
  // IPA 6: PILGAN (Fisika Rangkaian Listrik Arus Searah)
  {
    id: 'ipa-6',
    mapelId: 'ipa',
    topik: 'Hukum Ohm & Rangkaian Resistor',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Tiga buah resistor masing-masing bernilai $R_1 = 6\\ \\Omega$, $R_2 = 12\\ \\Omega$, dan $R_3 = 4\\ \\Omega$ dirangkai secara paralel. Hambatan pengganti total rangkaian paralel tersebut adalah...',
    pilganKunci: 'B',
    pilganOptions: [
      { label: 'A', teks: '$1.5\\ \\Omega$' },
      { label: 'B', teks: '$2.0\\ \\Omega$' },
      { label: 'C', teks: '$3.0\\ \\Omega$' },
      { label: 'D', teks: '$4.0\\ \\Omega$' },
    ],
    pembahasan: `$\\frac{1}{R_p} = \\frac{1}{6} + \\frac{1}{12} + \\frac{1}{4} = \\frac{2 + 1 + 3}{12} = \\frac{6}{12} = \\frac{1}{2}$.
Maka $R_p = 2.0\\ \\Omega$.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T09:15:00Z',
    updatedAt: '2026-01-22T09:15:00Z',
  },
  // IPA 7: KATEGORI (Kimia Asam Basa)
  {
    id: 'ipa-7',
    mapelId: 'ipa',
    topik: 'Larutan Asam Basa & Indikator',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: 'Tentukan sifat asam atau basa dari larutan-larutan sehari-hari berikut berdasarkan derajat keasamannya ($pH$):',
    kategoriLabels: ['Asam', 'Basa'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'ab-1', teks: 'Jus jeruk peras alami ($pH \\approx 3.5$)', kunciJawaban: 'Asam' },
      { id: 'ab-2', teks: 'Larutan pemutih pakaian / natrium hipoklorit ($pH \\approx 12.0$)', kunciJawaban: 'Basa' },
      { id: 'ab-3', teks: 'Cuka dapur / asam asetat ($pH \\approx 2.8$)', kunciJawaban: 'Asam' },
      { id: 'ab-4', teks: 'Larutan sabun mandi batangan ($pH \\approx 9.5$)', kunciJawaban: 'Basa' },
    ],
    pembahasan: `$pH < 7$ bersifat asam, sedangkan $pH > 7$ bersifat basa. Jus jeruk dan cuka ber-pH asam, sedangkan pemutih dan sabun ber-pH basa.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T09:30:00Z',
    updatedAt: '2026-01-22T09:30:00Z',
  },
  // IPA 8: PILGAN (Fisika Optika Geometri)
  {
    id: 'ipa-8',
    mapelId: 'ipa',
    topik: 'Cermin & Lensa Cembung',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: 'Benda setinggi $5\\text{ cm}$ diletakkan pada jarak $15\\text{ cm}$ di depan sebuah lensa cembung dengan jarak fokus $f = 10\\text{ cm}$. Jarak bayangan yang terbentuk dari lensa adalah...',
    pilganKunci: 'C',
    pilganOptions: [
      { label: 'A', teks: '$10\\text{ cm}$' },
      { label: 'B', teks: '$20\\text{ cm}$' },
      { label: 'C', teks: '$30\\text{ cm}$' },
      { label: 'D', teks: '$40\\text{ cm}$' },
    ],
    pembahasan: `Rumus lensa tipis: $\\frac{1}{f} = \\frac{1}{s} + \\frac{1}{s\'}$.
$\\frac{1}{s\'} = \\frac{1}{10} - \\frac{1}{15} = \\frac{3 - 2}{30} = \\frac{1}{30}$.
Maka $s\' = 30\\text{ cm}$ (bayangan nyata di belakang lensa).`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T09:45:00Z',
    updatedAt: '2026-01-22T09:45:00Z',
  },
  // IPA 9: MCMA (Bioteknologi Modern)
  {
    id: 'ipa-9',
    mapelId: 'ipa',
    topik: 'Rekayasa Genetika & Bioteknologi',
    tingkatKesulitan: 'sulit',
    modelSoal: 'mcma',
    teksSoal: 'Teknik DNA rekombinan dalam produksi hormon insulin manusia memanfaatkan instrumen molekuler berupa: (Pilih semua yang tepat)',
    mcmaKunci: ['A', 'B'],
    mcmaScoringMode: 'proportional',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Enzim endonuklease restriksi untuk memotong untai DNA secara spesifik.' },
      { id: 'B', label: 'B', teks: 'Enzim DNA ligase untuk menyambungkan fragmen gen insulin ke plasmid vektor.' },
      { id: 'C', label: 'C', teks: 'Enzim amilase untuk memecah pati menjadi asam amino.' },
      { id: 'D', label: 'D', teks: 'Bakteriofag sebagai pengurai dinding sel tumbuhan.' },
    ],
    pembahasan: `DNA rekombinan memerlukan enzim restriksi pemotong (A) dan enzim ligase penyambung (B) untuk disisipkan ke vektor plasmid bakteri.`,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Dra. Siti Rahmawati',
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-01-22T10:00:00Z',
  },
  // IPA 10: KATEGORI (Fisika Termodinamika)
  {
    id: 'ipa-10',
    mapelId: 'ipa',
    topik: 'Termodinamika Gas Ideal',
    tingkatKesulitan: 'sedang',
    modelSoal: 'kategori',
    teksSoal: 'Perhatikan proses termodinamika gas ideal pada tabel berikut. Tentukan kebenaran dari setiap deskripsi proses:',
    kategoriLabels: ['Benar', 'Salah'],
    kategoriScoringMode: 'per_row',
    kategoriPernyataan: [
      { id: 'td-1', teks: 'Proses Isobarik berlangsung pada tekanan konstan ($P = \\text{konstan}$).', kunciJawaban: 'Benar' },
      { id: 'td-2', teks: 'Proses Isokhorik tidak melakukan kerja luar ($W = 0$) karena tidak ada perubahan volume.', kunciJawaban: 'Benar' },
      { id: 'td-3', teks: 'Proses Adiabatik memungkinkan kalor masuk dan keluar sistem secara bebas.', kunciJawaban: 'Salah' },
    ],
    pembahasan: `Isobarik = tekanan konstan (Benar).
Isokhorik = volume konstan, $W = P \\Delta V = 0$ (Benar).
Adiabatik = tidak ada pertukaran kalor antara sistem dan lingkungan ($Q = 0$). Deskripsi pada pernyataan 3 salah.`,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, M.Pd.',
    createdAt: '2026-01-22T10:15:00Z',
    updatedAt: '2026-01-22T10:15:00Z',
  },
];

export const INITIAL_PACKAGES: ExamPackage[] = [
  {
    id: 'pkg-1',
    judul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapelId: 'matematika',
    deskripsi: 'Paket lengkap 30 soal TKA Matematika Sekolah Dasar (SD/MI) 2026 mencakup Bilangan Rasional, Operasi Bilangan, Geometri & Pengukuran, serta Pengolahan Data & Diagram dengan ilustrasi resmi.',
    durasiMenit: 90,
    bobotBenar: 4,
    bobotSalah: 0,
    bobotKosong: 0,
    acakSoal: true,
    acakOpsi: false,
    waktuBuka: '2026-01-01T00:00:00Z',
    waktuTutup: '2026-12-31T23:59:59Z',
    kelasAkses: ['semua'],
    soalIds: [
      'mtk-1', 'mtk-2', 'mtk-3', 'mtk-4', 'mtk-5', 'mtk-6', 'mtk-7', 'mtk-8', 'mtk-9', 'mtk-10',
      'mtk-11', 'mtk-12', 'mtk-13', 'mtk-14', 'mtk-15', 'mtk-16', 'mtk-17', 'mtk-18', 'mtk-19', 'mtk-20',
      'mtk-21', 'mtk-22', 'mtk-23', 'mtk-24', 'mtk-25', 'mtk-26', 'mtk-27', 'mtk-28', 'mtk-29', 'mtk-30',
    ],
    status: 'terbit',
    izinkanLihatPembahasan: true,
    deteksiPindahTab: true,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-01-23T08:00:00Z',
  },
  {
    id: 'pkg-2',
    judul: 'Tryout TKA Bahasa Indonesia SD/MI 2026 (29 Soal Lengkap)',
    mapelId: 'bahasa_indonesia',
    deskripsi: 'Paket lengkap 29 soal TKA Bahasa Indonesia Sekolah Dasar (SD/MI) 2026 mencakup Pemahaman Tekstual, Pemahaman Inferensial, serta Evaluasi dan Apresiasi berbasis 11 wacana dan ilustrasi resmi.',
    durasiMenit: 90,
    bobotBenar: 4,
    bobotSalah: 0,
    bobotKosong: 0,
    acakSoal: false,
    acakOpsi: false,
    waktuBuka: '2026-01-01T00:00:00Z',
    waktuTutup: '2026-12-31T23:59:59Z',
    kelasAkses: ['semua'],
    soalIds: [
      'bind-1', 'bind-2', 'bind-3', 'bind-4', 'bind-5', 'bind-6', 'bind-7', 'bind-8', 'bind-9', 'bind-10',
      'bind-11', 'bind-12', 'bind-13', 'bind-14', 'bind-15', 'bind-16', 'bind-17', 'bind-18', 'bind-19', 'bind-20',
      'bind-21', 'bind-22', 'bind-23', 'bind-24', 'bind-25', 'bind-26', 'bind-27', 'bind-28', 'bind-29',
    ],
    status: 'terbit',
    izinkanLihatPembahasan: true,
    deteksiPindahTab: true,
    pembuatId: 'usr-guru-2',
    pembuatNama: 'Siti Rahmawati, S.Pd.',
    createdAt: '2026-01-23T09:00:00Z',
  },
  {
    id: 'pkg-3',
    judul: 'Evaluasi IPA & Sains Alam Terpadu (IPAS SD)',
    mapelId: 'ipa',
    deskripsi: 'Evaluasi pemahaman konsep ekosistem mahluk hidup, rantai makanan, bagian tumbuhan/hewan, dan pemeliharaan lingkungan hidup di sekitar kita.',
    durasiMenit: 35,
    bobotBenar: 4,
    bobotSalah: 0,
    bobotKosong: 0,
    acakSoal: true,
    acakOpsi: false,
    waktuBuka: '2026-01-01T00:00:00Z',
    waktuTutup: '2026-12-31T23:59:59Z',
    kelasAkses: ['semua'],
    soalIds: ['ipa-1', 'ipa-2', 'ipa-3', 'ipa-4', 'ipa-5', 'ipa-6', 'ipa-7', 'ipa-8', 'ipa-9', 'ipa-10'],
    status: 'terbit',
    izinkanLihatPembahasan: true,
    deteksiPindahTab: true,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi Santoso, S.Pd.',
    createdAt: '2026-01-23T10:00:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-1',
    judul: 'Pelaksanaan Ujian Akhir Semester & Asesmen SD Telah Dibuka',
    konten: 'Seluruh siswa-siswi Kelas 5 dan 6 dihimbau untuk mengerjakan paket latihan Matematika, Bahasa Indonesia, dan IPA. Jangan terburu-buru dan teliti membaca setiap soal.',
    tipe: 'penting',
    tanggal: '2026-02-01',
    penulis: 'Kepala Sekolah SD',
    targetRole: 'semua',
  },
  {
    id: 'anc-2',
    judul: 'Tata Tertib CBT Siswa SD',
    konten: 'Kerjakan soal dengan mandiri dan jujur. Sistem akan mencatat bila peramban ditutup atau berpindah aplikasi. Manfaatkan waktu yang tersedia dengan sebaik-baiknya.',
    tipe: 'info',
    tanggal: '2026-02-05',
    penulis: 'Guru Kelas / Pengawas',
    targetRole: 'murid',
  },
  {
    id: 'anc-3',
    judul: 'Panduan Penyusunan Soal Bergambar & Cerita Ramah Anak',
    konten: 'Bapak/Ibu Guru dapat menyisipkan gambar ilustrasi, wacana dongeng/cerita anak, serta model soal Kategori Benar/Salah yang mudah dipahami murid SD.',
    tipe: 'jadwal',
    tanggal: '2026-02-10',
    penulis: 'Koordinator Kurikulum SD',
    targetRole: 'guru',
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  namaSekolah: 'SD Unggulan Nusantara',
  logoUrl: '/assets/aistudio/paket_sinau_724f1ed0.jpg',
  tahunAjaran: '2025/2026',
  semester: 'Genap',
  footerNotice: 'PAKET SINAU — Sistem Ujian Berbasis Komputer Sekolah Dasar (CBT SD)',
  maksimalPeringatanTab: 3,
};

// Seed sample completed exam sessions for statistics, curves, and charts
export const INITIAL_SESSIONS: ExamSession[] = [
  // --- Raditya Pratama (usr-murid-1) ---
  {
    id: 'ses-raditya-mtk-1',
    paketId: 'pkg-1',
    paketJudul: 'Latihan Pra-Asesmen: Berhitung Dasar',
    mapelId: 'matematika',
    muridId: 'usr-murid-1',
    muridNama: 'Raditya Pratama',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-02T08:00:00Z',
    waktuSelesai: '2026-02-02T08:31:00Z',
    durasiDetikTerpakai: 1860,
    sisaDetik: 240,
    status: 'selesai',
    shuffledSoalIds: ['mtk-1', 'mtk-2', 'mtk-3', 'mtk-4', 'mtk-5', 'mtk-6', 'mtk-7', 'mtk-8', 'mtk-9', 'mtk-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 29,
    skorMaksimal: 40,
    persentaseNilai: 72.5,
    jumlahBenar: 7,
    jumlahSalah: 3,
    jumlahKosong: 0,
    answers: {},
  },
  {
    id: 'ses-raditya-bind-1',
    paketId: 'pkg-2',
    paketJudul: 'Tryout TKA Bahasa Indonesia SD/MI 2026 (29 Soal Lengkap)',
    mapelId: 'bahasa_indonesia',
    muridId: 'usr-murid-1',
    muridNama: 'Raditya Pratama',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-08T08:30:00Z',
    waktuSelesai: '2026-02-08T08:58:00Z',
    durasiDetikTerpakai: 1680,
    sisaDetik: 120,
    status: 'selesai',
    shuffledSoalIds: [
      'bind-1', 'bind-2', 'bind-3', 'bind-4', 'bind-5', 'bind-6', 'bind-7', 'bind-8', 'bind-9', 'bind-10',
      'bind-11', 'bind-12', 'bind-13', 'bind-14', 'bind-15', 'bind-16', 'bind-17', 'bind-18', 'bind-19', 'bind-20',
      'bind-21', 'bind-22', 'bind-23', 'bind-24', 'bind-25', 'bind-26', 'bind-27', 'bind-28', 'bind-29',
    ],
    jumlahPelanggaranTab: 0,
    totalSkor: 92.8,
    skorMaksimal: 116,
    persentaseNilai: 80.0,
    jumlahBenar: 23,
    jumlahSalah: 6,
    jumlahKosong: 0,
    answers: {},
  },
  {
    id: 'ses-raditya-mtk-2',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapelId: 'matematika',
    muridId: 'usr-murid-1',
    muridNama: 'Raditya Pratama',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-12T08:00:00Z',
    waktuSelesai: '2026-02-12T08:48:00Z',
    durasiDetikTerpakai: 2880,
    sisaDetik: 2520,
    status: 'selesai',
    shuffledSoalIds: ['mtk-1', 'mtk-2', 'mtk-3', 'mtk-4', 'mtk-5', 'mtk-6', 'mtk-7', 'mtk-8', 'mtk-9', 'mtk-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 34.67,
    skorMaksimal: 40,
    persentaseNilai: 86.7,
    jumlahBenar: 8,
    jumlahSalah: 2,
    jumlahKosong: 0,
    answers: {
      'mtk-1': { questionId: 'mtk-1', modelSoal: 'kategori', state: 'sudah_dijawab', kategoriAnswer: { 'mtk1-stmt-1': 'Benar', 'mtk1-stmt-2': 'Salah', 'mtk1-stmt-3': 'Benar' }, isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
      'mtk-2': { questionId: 'mtk-2', modelSoal: 'pilgan', state: 'sudah_dijawab', pilganAnswer: 'C', isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
      'mtk-3': { questionId: 'mtk-3', modelSoal: 'mcma', state: 'sudah_dijawab', mcmaAnswer: ['A', 'B'], isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
      'mtk-4': { questionId: 'mtk-4', modelSoal: 'pilgan', state: 'sudah_dijawab', pilganAnswer: 'D', isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
      'mtk-5': { questionId: 'mtk-5', modelSoal: 'pilgan', state: 'sudah_dijawab', pilganAnswer: 'A', isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
      'mtk-6': { questionId: 'mtk-6', modelSoal: 'pilgan', state: 'sudah_dijawab', pilganAnswer: 'C', isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
      'mtk-7': { questionId: 'mtk-7', modelSoal: 'kategori', state: 'sudah_dijawab', kategoriAnswer: { 'mtk7-stmt-1': 'Salah', 'mtk7-stmt-2': 'Benar', 'mtk7-stmt-3': 'Salah' }, isFullyCorrect: false, scoreAwarded: 2.67, maxScorePossible: 4 },
      'mtk-8': { questionId: 'mtk-8', modelSoal: 'pilgan', state: 'sudah_dijawab', pilganAnswer: 'A', isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
      'mtk-9': { questionId: 'mtk-9', modelSoal: 'mcma', state: 'sudah_dijawab', mcmaAnswer: ['B'], isFullyCorrect: false, scoreAwarded: 2, maxScorePossible: 4 },
      'mtk-10': { questionId: 'mtk-10', modelSoal: 'pilgan', state: 'sudah_dijawab', pilganAnswer: 'C', isFullyCorrect: true, scoreAwarded: 4, maxScorePossible: 4 },
    },
  },
  {
    id: 'ses-raditya-ipa-1',
    paketId: 'pkg-3',
    paketJudul: 'Evaluasi IPA & Sains Alam Terpadu (IPAS SD)',
    mapelId: 'ipa',
    muridId: 'usr-murid-1',
    muridNama: 'Raditya Pratama',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-20T09:00:00Z',
    waktuSelesai: '2026-02-20T09:27:00Z',
    durasiDetikTerpakai: 1620,
    sisaDetik: 480,
    status: 'selesai',
    shuffledSoalIds: ['ipa-1', 'ipa-2', 'ipa-3', 'ipa-4', 'ipa-5', 'ipa-6', 'ipa-7', 'ipa-8', 'ipa-9', 'ipa-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 37,
    skorMaksimal: 40,
    persentaseNilai: 92.5,
    jumlahBenar: 9,
    jumlahSalah: 1,
    jumlahKosong: 0,
    answers: {},
  },

  // --- Annisa Rahmawati (usr-murid-2) ---
  {
    id: 'ses-annisa-mtk-1',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapelId: 'matematika',
    muridId: 'usr-murid-2',
    muridNama: 'Annisa Rahmawati',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-05T08:00:00Z',
    waktuSelesai: '2026-02-05T08:30:00Z',
    durasiDetikTerpakai: 1800,
    sisaDetik: 300,
    status: 'selesai',
    shuffledSoalIds: ['mtk-1', 'mtk-2', 'mtk-3', 'mtk-4', 'mtk-5', 'mtk-6', 'mtk-7', 'mtk-8', 'mtk-9', 'mtk-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 33,
    skorMaksimal: 40,
    persentaseNilai: 82.5,
    jumlahBenar: 8,
    jumlahSalah: 2,
    jumlahKosong: 0,
    answers: {},
  },
  {
    id: 'ses-annisa-bind',
    paketId: 'pkg-2',
    paketJudul: 'Tryout TKA Bahasa Indonesia SD/MI 2026 (29 Soal Lengkap)',
    mapelId: 'bahasa_indonesia',
    muridId: 'usr-murid-2',
    muridNama: 'Annisa Rahmawati',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-14T09:00:00Z',
    waktuSelesai: '2026-02-14T09:32:00Z',
    durasiDetikTerpakai: 1920,
    sisaDetik: 480,
    status: 'selesai',
    shuffledSoalIds: [
      'bind-1', 'bind-2', 'bind-3', 'bind-4', 'bind-5', 'bind-6', 'bind-7', 'bind-8', 'bind-9', 'bind-10',
      'bind-11', 'bind-12', 'bind-13', 'bind-14', 'bind-15', 'bind-16', 'bind-17', 'bind-18', 'bind-19', 'bind-20',
      'bind-21', 'bind-22', 'bind-23', 'bind-24', 'bind-25', 'bind-26', 'bind-27', 'bind-28', 'bind-29',
    ],
    jumlahPelanggaranTab: 0,
    totalSkor: 110.2,
    skorMaksimal: 116,
    persentaseNilai: 95.0,
    jumlahBenar: 27,
    jumlahSalah: 2,
    jumlahKosong: 0,
    answers: {},
  },
  {
    id: 'ses-annisa-ipa-1',
    paketId: 'pkg-3',
    paketJudul: 'Evaluasi IPA & Sains Alam Terpadu (IPAS SD)',
    mapelId: 'ipa',
    muridId: 'usr-murid-2',
    muridNama: 'Annisa Rahmawati',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-24T10:00:00Z',
    waktuSelesai: '2026-02-24T10:28:00Z',
    durasiDetikTerpakai: 1680,
    sisaDetik: 420,
    status: 'selesai',
    shuffledSoalIds: ['ipa-1', 'ipa-2', 'ipa-3', 'ipa-4', 'ipa-5', 'ipa-6', 'ipa-7', 'ipa-8', 'ipa-9', 'ipa-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 36,
    skorMaksimal: 40,
    persentaseNilai: 90.0,
    jumlahBenar: 9,
    jumlahSalah: 1,
    jumlahKosong: 0,
    answers: {},
  },

  // --- Fajar Nugraha (usr-murid-3) ---
  {
    id: 'ses-fajar-mtk-1',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapelId: 'matematika',
    muridId: 'usr-murid-3',
    muridNama: 'Fajar Nugraha',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-03T08:00:00Z',
    waktuSelesai: '2026-02-03T08:34:00Z',
    durasiDetikTerpakai: 2040,
    sisaDetik: 60,
    status: 'selesai',
    shuffledSoalIds: ['mtk-1', 'mtk-2', 'mtk-3', 'mtk-4', 'mtk-5', 'mtk-6', 'mtk-7', 'mtk-8', 'mtk-9', 'mtk-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 26,
    skorMaksimal: 40,
    persentaseNilai: 65.0,
    jumlahBenar: 6,
    jumlahSalah: 4,
    jumlahKosong: 0,
    answers: {},
  },
  {
    id: 'ses-fajar-ipa',
    paketId: 'pkg-3',
    paketJudul: 'Evaluasi IPA & Sains Alam Terpadu (IPAS SD)',
    mapelId: 'ipa',
    muridId: 'usr-murid-3',
    muridNama: 'Fajar Nugraha',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-15T10:00:00Z',
    waktuSelesai: '2026-02-15T10:44:00Z',
    durasiDetikTerpakai: 2640,
    sisaDetik: 360,
    status: 'selesai',
    shuffledSoalIds: ['ipa-1', 'ipa-2', 'ipa-3', 'ipa-4', 'ipa-5', 'ipa-6', 'ipa-7', 'ipa-8', 'ipa-9', 'ipa-10'],
    jumlahPelanggaranTab: 1,
    totalSkor: 34,
    skorMaksimal: 40,
    persentaseNilai: 85.0,
    jumlahBenar: 8,
    jumlahSalah: 2,
    jumlahKosong: 0,
    answers: {},
  },
  {
    id: 'ses-fajar-bind-1',
    paketId: 'pkg-2',
    paketJudul: 'Tryout TKA Bahasa Indonesia SD/MI 2026 (29 Soal Lengkap)',
    mapelId: 'bahasa_indonesia',
    muridId: 'usr-murid-3',
    muridNama: 'Fajar Nugraha',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-26T08:00:00Z',
    waktuSelesai: '2026-02-26T08:26:00Z',
    durasiDetikTerpakai: 1560,
    sisaDetik: 240,
    status: 'selesai',
    shuffledSoalIds: [
      'bind-1', 'bind-2', 'bind-3', 'bind-4', 'bind-5', 'bind-6', 'bind-7', 'bind-8', 'bind-9', 'bind-10',
      'bind-11', 'bind-12', 'bind-13', 'bind-14', 'bind-15', 'bind-16', 'bind-17', 'bind-18', 'bind-19', 'bind-20',
      'bind-21', 'bind-22', 'bind-23', 'bind-24', 'bind-25', 'bind-26', 'bind-27', 'bind-28', 'bind-29',
    ],
    jumlahPelanggaranTab: 0,
    totalSkor: 92.8,
    skorMaksimal: 116,
    persentaseNilai: 80.0,
    jumlahBenar: 23,
    jumlahSalah: 6,
    jumlahKosong: 0,
    answers: {},
  },

  // --- Zahra Aulia (usr-murid-4) ---
  {
    id: 'ses-zahra-bind-1',
    paketId: 'pkg-2',
    paketJudul: 'Tryout TKA Bahasa Indonesia SD/MI 2026 (29 Soal Lengkap)',
    mapelId: 'bahasa_indonesia',
    muridId: 'usr-murid-4',
    muridNama: 'Zahra Aulia',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-06T09:00:00Z',
    waktuSelesai: '2026-02-06T09:28:00Z',
    durasiDetikTerpakai: 1680,
    sisaDetik: 120,
    status: 'selesai',
    shuffledSoalIds: [
      'bind-1', 'bind-2', 'bind-3', 'bind-4', 'bind-5', 'bind-6', 'bind-7', 'bind-8', 'bind-9', 'bind-10',
      'bind-11', 'bind-12', 'bind-13', 'bind-14', 'bind-15', 'bind-16', 'bind-17', 'bind-18', 'bind-19', 'bind-20',
      'bind-21', 'bind-22', 'bind-23', 'bind-24', 'bind-25', 'bind-26', 'bind-27', 'bind-28', 'bind-29',
    ],
    jumlahPelanggaranTab: 0,
    totalSkor: 90,
    skorMaksimal: 116,
    persentaseNilai: 77.6,
    jumlahBenar: 22,
    jumlahSalah: 6,
    jumlahKosong: 1,
    answers: {},
  },
  {
    id: 'ses-zahra-mtk-1',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapelId: 'matematika',
    muridId: 'usr-murid-4',
    muridNama: 'Zahra Aulia',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-18T08:00:00Z',
    waktuSelesai: '2026-02-18T08:30:00Z',
    durasiDetikTerpakai: 1800,
    sisaDetik: 300,
    status: 'selesai',
    shuffledSoalIds: ['mtk-1', 'mtk-2', 'mtk-3', 'mtk-4', 'mtk-5', 'mtk-6', 'mtk-7', 'mtk-8', 'mtk-9', 'mtk-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 34,
    skorMaksimal: 40,
    persentaseNilai: 85.0,
    jumlahBenar: 8,
    jumlahSalah: 2,
    jumlahKosong: 0,
    answers: {},
  },
  {
    id: 'ses-zahra-ipa-1',
    paketId: 'pkg-3',
    paketJudul: 'Evaluasi IPA & Sains Alam Terpadu (IPAS SD)',
    mapelId: 'ipa',
    muridId: 'usr-murid-4',
    muridNama: 'Zahra Aulia',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-02-28T09:00:00Z',
    waktuSelesai: '2026-02-28T09:25:00Z',
    durasiDetikTerpakai: 1500,
    sisaDetik: 600,
    status: 'selesai',
    shuffledSoalIds: ['ipa-1', 'ipa-2', 'ipa-3', 'ipa-4', 'ipa-5', 'ipa-6', 'ipa-7', 'ipa-8', 'ipa-9', 'ipa-10'],
    jumlahPelanggaranTab: 0,
    totalSkor: 36,
    skorMaksimal: 40,
    persentaseNilai: 90.0,
    jumlahBenar: 9,
    jumlahSalah: 1,
    jumlahKosong: 0,
    answers: {},
  },
];
