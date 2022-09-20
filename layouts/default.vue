<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-web</v-icon>
          {{$t('language')}}
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="lang in languages" :key="lang.code" @click="switchLang(lang.i18n)">
          <v-list-item-icon>
            <gb-flag :code="lang.code"></gb-flag>
          </v-list-item-icon>
          <v-list-item-title>{{lang.text}}</v-list-item-title>
        </v-list-item>
      </v-list>
      </v-menu>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import { localize } from 'vee-validate'
export default {
  name: 'DefaultLayout',
  data() {
    return {
      languages: [
        { code: 'jp', text: '日本語', i18n: 'ja', bcp47: 'ja'},
        { code: 'gb', text: 'English', i18n: 'en', bcp47: 'en'},
        { code: 'vi', text: 'Tiếng Việt', i18n: 'vi', bcp47: 'vi'}
      ],
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
        {
          icon: 'mdi-account-group',
          title: 'Organizations',
          to: '/organizations'
        },
        {
          icon: 'mdi-account-multiple-plus',
          title: 'Create Organization',
          to: '/organizations/new'
        },
        {
          icon: 'mdi-account-plus',
          title: 'Members',
          to: '/members'
        },
        {
          icon: 'mdi-account-plus',
          title: 'Projects',
          to: '/projects'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'ShaResouce',
    }
  },
  methods: {
   async switchLang(code) {
      await this.$i18n.setLocale(code)
      await localize(code)
    }
  }
}
</script>
