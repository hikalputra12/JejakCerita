import developerPhoto from '../../assets/images/foto-developer.jpeg'; // Adjust path as needed

export default class AboutPage {
  async render() {
    return `
      <section class="about-section">
        <h1 class="section-title">Tentang Jejak Cerita</h1>
        <div>
          <p>Selamat datang di <strong>Jejak Cerita</strong>, platform di mana setiap petualangan menemukan rumahnya. Kami percaya bahwa setiap perjalanan, besar atau kecil, memiliki kisah unik yang layak untuk dibagikan.</p>


            <h2>Visi Kami</h2>
            <p>Menjadi komunitas global terkemuka untuk para penjelajah, penulis, dan siapa pun yang ingin mengabadikan serta berbagi momen berharga mereka di seluruh dunia.</p>

            <h2>Misi Kami</h2>
            <ul>
              <li><i class="fas fa-check-circle"></i>Menyediakan alat yang intuitif dan mudah digunakan untuk merekam cerita Anda, lengkap dengan lokasi geografis dan foto yang memukau.</li>
              <li><i class="fas fa-check-circle"></i>Menciptakan ruang di mana pengguna dapat dengan mudah menemukan, menjelajahi, dan terinspirasi oleh kisah-kisah otentik dari berbagai sudut bumi.</li>
              <li><i class="fas fa-check-circle"></i>Membangun jembatan koneksi antar sesama penjelajah dan pecinta cerita.</li>
              <li><i class="fas fa-check-circle"></i>Memastikan aksesibilitas bagi semua, sehingga setiap orang dapat berpartisipasi dan menikmati keindahan berbagi cerita.</li>
            </ul>

            <h2>Bagaimana Jejak Cerita Bekerja?</h2>
            <p>Dengan Jejak Cerita, Anda dapat:</p>
            <div>
              <i class="fas fa-edit fa-3x"></i>
              <h4>Bagikan Kisah Anda</h4>
              <p>Tuliskan pengalaman Anda, lampirkan foto dari momen-momen penting, dan tandai lokasi persisnya di peta.</p>
            </div>
            <div>
              <i class="fas fa-map-marked-alt fa-3x"></i>
              <h4>Jelajahi Peta Cerita</h4>
              <p>Lihat cerita-cerita dari seluruh dunia yang ditampilkan di peta interaktif kami. Temukan kisah-kisah tersembunyi.</p>
            </div>
            <div>
              <i class="fas fa-users fa-3x"></i>
              <h4>Terhubung</h4>
              <p>Baca, komentari, dan dapatkan inspirasi dari cerita-cerita yang dibagikan oleh komunitas kami.</p>
            </div>

            <h2>Tim di Balik Jejak Cerita</h2>
            <div>
              <img src="${developerPhoto}" alt="Foto Developer Utama Julianda Putra Mansur">
              <h3>Julianda Putra Mansur</h3>
              <p>Pengembang Utama</p>
              <p>Berkomitmen untuk menciptakan pengalaman berbagi cerita yang mulus dan bermakna.</p>
            </div>

            <h2>Hubungi Kami</h2>
            <p>Punya pertanyaan, saran, atau hanya ingin menyapa? Jangan ragu untuk menghubungi kami melalui email:</p>
            <p><a href="mailto:support@jejakcerita.com">support@jejakcerita.com</a></p>
          </div>
      </section>`;
  }
}