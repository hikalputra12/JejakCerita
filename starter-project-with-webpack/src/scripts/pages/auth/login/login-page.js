import LoginPresenter from './login-presenter';
import * as JejakCerita from '../../../data/api';
import * as AuthModel from '../../../utils/auth';

export default class LoginPage {
  #presenter = null;
  #loginForm = null;
  #submitButton = null;
  #originalSubmitButtonText = '';

  async render() {
    return `
      <section class="login-container">
        <article class="login-form-container">
          <h1 class="login__title">Masuk akun</h1>

          <form id="login-form" class="login-form">
            <div class="form-control">
              <label for="email-input" class="login-form__email-title">Email</label>

              <div class="login-form__title-container">
                <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com">
              </div>
            </div>
            <div class="form-control">
              <label for="password-input" class="login-form__password-title">Password</label>

              <div class="login-form__title-container">
                <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda">
              </div>
            </div>
            <div class="form-buttons login-form__form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Masuk</button>
              </div>
              <p class="login-form__do-not-have-account">Belum punya akun? <a href="#/register">Daftar</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: JejakCerita,
      authModel: AuthModel,
    });

    this.#loginForm = document.getElementById('login-form');
    this.#submitButton = this.#loginForm.querySelector('#submit-button-container button');
    if (this.#submitButton) {
      this.#originalSubmitButtonText = this.#submitButton.innerHTML;
    }
    this.#setupForm();
  }

  #setupForm() {
    this.#loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = {
        email: this.#loginForm.elements.email.value,
        password: this.#loginForm.elements.password.value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  loginSuccessfully(message) {
    console.log(message);
    location.hash = '/';
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    if (this.#submitButton) {
      this.#submitButton.disabled = true;
      this.#submitButton.innerHTML = `
        <i class="fas fa-spinner fa-spin loader-button"></i> Masuk
      `;
    }
  }

  hideSubmitLoadingButton() {
    if (this.#submitButton) {
      this.#submitButton.disabled = false;
      this.#submitButton.innerHTML = this.#originalSubmitButtonText;
    }
  }
}