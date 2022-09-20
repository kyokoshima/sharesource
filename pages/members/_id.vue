<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-toolbar>
    <v-toolbar-title>
      {{$t('member')}}
    </v-toolbar-title>
  </v-toolbar>
    <form @submit.prevent="submit">
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-select :items="organizations" :label="$t('organization')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              :name="$t('member-id')"
              rules="required|max:10"
            >
              <v-text-field
                v-model="memberId"
                :counter="10"
                :error-messages="errors"
                :label="$t('member-id')"
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              :name="$t('last-name')"
              rules="required|max:10"
            >
              <v-text-field
                v-model="lastName"
                :counter="10"
                :error-messages="errors"
                :label="$t('last-name')"
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              :name="$t('first-name')"
              rules="required|max:10"
            >
              <v-text-field
                v-model="firstName"
                :counter="10"
                :error-messages="errors"
                :label="$t('first-name')"
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              :name="$t('email')"
              rules="required|email"
            >
              <v-text-field
                v-model="email"
                :counter="10"
                :error-messages="errors"
                :label="$t('email')"
                required
                :loading="loading"
              ></v-text-field>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="description" rows="3" :placeholder="$t('description')">
            </v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-subheader>{{$t('joining-projects')}}</v-subheader>
            <v-list>
              <v-list-item-content>
              <v-list-item-title v-if="projects.length == 0">
                No project
              </v-list-item-title>
              <v-list-item-title v-else v-for="project in projects" v-bind:key="project.id">
                {{ project }}
              </v-list-item-title>
            </v-list-item-content>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
          <v-btn class="mr-4" type="submit" :disabled="invalid">{{$t('submit')}}</v-btn>
          <v-btn @click="clear">{{$t('clear')}}</v-btn>
        </v-col>
        </v-row>

      </v-container>
    </form>
  </validation-observer>
</template>
<script>
// import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
import {
  extend,
  // ValidationObserver,
  // ValidationProvider,
  // setInteractionMode,
} from 'vee-validate'

// setInteractionMode('eager')

// extend('digits', {
//   ...digits,
//   message: '{_field_} needs to be {length} digits. ({_value_})',
// })

// extend('required', {
//   ...required,
//   message: '{_field_} can not be empty',
// })

// extend('max', {
//   ...max,
//   message: '{_field_} may not be greater than {length} characters',
// })

// extend('regex', {
//   ...regex,
//   message: '{_field_} {_value_} does not match {regex}',
// })

// extend('email', {
//   ...email,
//   message: 'Email must be valid',
// })

export default {
  components: {
    // ValidationProvider,
    // ValidationObserver,
  },
  data: () => ({
    memberId: '',
    firstName: '',
    lastName: '',
    email: '',
    description: '',
    loading: false,
    organizations: [],
    projects: [],
  }),
  async created() {
    this.memberRepository = this.$repositories('member')
    this.organizationRepository = this.$repositories('organization')
    this.projectRepository = this.$repositories('project')
    this.organizations = await this.organizationRepository.findAll()
    this.organizations = this.organizations.map((v) => ({
      text: v.name,
      value: v.id,
    }))
    console.log(this.$route.params.id)
    this.projects = await this.projectRepository.findBy('memberId', this.memberId)
    console.log(this.projects)
    extend('uniq', this.validateEmail)
  },
  methods: {
    async validateEmail(email) {
      this.loading = true
      const exists = await this.repository.existsByName(email)
      this.loading = false
      return !exists ? true : 'This name is already taken'
    },
    async submit() {
      // this.$refs.observer.validate()
      // console.log(this.$cosmos)
      // const r = this.$cosmos.query("organization", `name = ${this.name}`)
      // console.log(r)

      // const rps = this.$repositories
      // console.log(rps)
      // const e = this.$repositories("organization").findByName(this.name)
      // console.log(repository)
      // const r= await repository.existsByName(this.name)
      // console.log(r)
      // console.log(e)
      // const r = repository.findByName(this.name)
      // console.log(r)
      // console.log(this.name)
      // try {
      // await this.repository.create(this.name)
      this.$router.push('/members')
      // } catch (error) {
      //   console.log(error)
      // }
    },
    clear() {
      this.name = ''
      this.$refs.observer.reset()
    },
  },
}
</script>
