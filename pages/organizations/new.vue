<template>
  <validation-observer
    ref="observer"
    v-slot="{ invalid }"
  >
    <form @submit.prevent="submit">
      <validation-provider
        v-slot="{ errors }"
        name="Name"
        rules="required|max:10|uniq"
      >
        <v-text-field
          v-model="name"
          :counter="10"
          :error-messages="errors"
          label="Name"
          required
          :loading="loading"
        ></v-text-field>
      </validation-provider>

      <v-btn
        class="mr-4"
        type="submit"
        :disabled="invalid"
      >
        submit
      </v-btn>
      <v-btn @click="clear">
        clear
      </v-btn>
    </form>
  </validation-observer>
</template>
<script>
  import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

  setInteractionMode('eager')

  extend('digits', {
    ...digits,
    message: '{_field_} needs to be {length} digits. ({_value_})',
  })

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('regex', {
    ...regex,
    message: '{_field_} {_value_} does not match {regex}',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {

    components: {
      ValidationProvider,
      ValidationObserver,
    },
    data: () => ({
      name: '',
      loading: false
    }),
    created() {
      this.repository = this.$repositories("organization")
      extend('uniq', this.validateOrganizationName)
    },
    methods: {
      async validateOrganizationName (name) {
        this.loading = true
        const exists = await this.repository.existsByName(name)
        this.loading = false
        return !exists ? true : 'This name is already taken'
      },
      async submit () {
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
          this.$router.push('/organizations')
        // } catch (error) {
        //   console.log(error)
        // }
        
      },
      clear () {
        this.name = ''
        this.$refs.observer.reset()
      },
    },
  }
</script>