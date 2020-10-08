<template>
  <div class="home">
    <v-container fluid>
      <v-app-bar v-cloak app clipped-left short dense color="secondary">
        <v-toolbar-title>{{ $t('page.landingPage.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="mr-4" active-class="v-btn--active" color="accent" to="main">
          sign up
        </v-btn>
        <v-btn active-class="v-btn--active" color="accent" to="main">
          <v-icon color="white" class="mr-2">play_circle_outline</v-icon>
          log in
        </v-btn>
      </v-app-bar>
      <v-carousel
        cycle
        height="66vh"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          :src="require('@/assets/Nexus.png')"
          contain
          title="Nexus"
        ></v-carousel-item>
      </v-carousel>
      <v-card>
        <v-card-text> Connect your games. </v-card-text>
        <v-card-text> Write your networking code only once. </v-card-text>
        <v-card-text>
          Free for small games with a progressive pricing model.
        </v-card-text>
      </v-card>

      <v-card class="mt-8">
        <v-card-text> Here is our current progress so far. </v-card-text>
      </v-card>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title> To Do </v-card-title>
            <v-card-text>
              <v-list v-for="(item, i) in getListFor('toDo')" :key="i">
                <v-list-item>
                  <v-list-item-icon
                    ><v-icon>arrow_right</v-icon></v-list-item-icon
                  >
                  <v-list-item-content>
                    {{ item }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title> In Progress </v-card-title>
            <v-card-text>
              <v-list v-for="(item, i) in getListFor('inProgress')" :key="i">
                <v-list-item>
                  <v-list-item-icon
                    ><v-icon>arrow_right</v-icon></v-list-item-icon
                  >
                  <v-list-item-content>
                    {{ item }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title> Done </v-card-title>
            <v-card-text>
              <v-list v-for="(item, i) in getListFor('done')" :key="i">
                <v-list-item>
                  <v-list-item-icon
                    ><v-icon>arrow_right</v-icon></v-list-item-icon
                  >
                  <v-list-item-content>
                    {{ item }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script type="js">
// @ is an alias to /src

export default {
  name: 'LandingPage',

  components: {},

  data: () => ({
    localeBackingField: '',
    raw: {},
    countAll: 0,
    loading: true
  }),

  watch: {},

  computed: {
    locale: {
      get () {
        return this.$i18n.locale
      },
      set (value) {
        this.localeBackingField = value
      }
    }
  },

  methods: {
    getListFor (section) {
      return this.$i18n.messages[this.$i18n.locale].page.landingPage.state[
        section
      ]
    }
  },

  mounted () {
    this.locale = this.$i18n.locale
  }
}
</script>

<style lang="scss">
@import 'index.scss';
</style>
