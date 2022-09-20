import Vue from 'vue'
import { setInteractionMode, ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate' // 使用する機能
import ja from 'vee-validate/dist/locale/ja.json' // エラーメッセージの日本語化用
import { required, max, email, digits,regex } from 'vee-validate/dist/rules' // 使用するバリデーションルール

setInteractionMode('eager')

extend('digits', digits)
extend('required',required)
extend('max', max)
extend('email', email)
extend('regex', regex)

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

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
localize('ja', ja)