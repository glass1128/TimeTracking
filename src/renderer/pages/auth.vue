<i18n src="@/assets/locales/pages/auth.json" />

<template>
  <section>
    <main-header />
    <form @submit.prevent="authenticate">
      <h1>{{ $t('title') }}</h1>
      <v-row
        align="center"
        :class="{
          'ma-25': $vuetify.breakpoint.smAndDown,
          'ma-25': $vuetify.breakpoint.mdAndUp
        }"
      >
        <v-img
          class="logo"
          src="
          static/blue_icon_128x128.png"
          alt="electron-vue"
          contain
          height="128px"
          width="123px"
        >
        </v-img>
      </v-row>
      <base-input
        v-model="email"
        class="has-border api-url"
        :placeholder="$t('email')"
        required
      />
      <base-input
        v-model="password"
        class="has-border api-url"
        type="password"
        :placeholder="$t('password')"
        required
      />
      <base-button type="submit" class="is-rounded is-primary">
        {{ $t('login') }}
      </base-button>
    </form>
  </section>
</template>

<script>
import BaseButton from '@/components/atoms/base-button';
import MainHeader from '@/components/molecules/main-header';
import BaseInput from '@/components/atoms/base-input';

export default {
  components: {
    BaseButton,
    BaseInput,
    MainHeader
  },
  data() {
    return {
      apiUrl: this.$store.getters['auth/apiUrl'],
      email: '',
      password: ''
    };
  },
  methods: {
    async authenticate() {
      const payload = { Eml: this.email, Pass: this.password };
      const flag = await this.$store.dispatch('auth/fetchAccessToken', payload);
      if (!flag) {
        console.log(flag);
        return;
      }
      this.$store.dispatch('toast/success', this.$t('loggedIn'));
      this.$router.push('/');
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  font-size: 20px;
  padding: 0;
  margin: 0;
  margin-bottom: 15px;
  text-align: center;
  font-weight: normal;
}
form {
  padding: 30px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
}
</style>
