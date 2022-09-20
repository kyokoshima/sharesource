<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-toolbar>
      <v-toolbar-title>{{ $t("project")}} </v-toolbar-title>
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
              :name="$t('project-name')"
              rules="required|max:10"
            >
              <v-text-field
                v-model="projectName"
                :counter="10"
                :error-messages="errors"
                :label="$t('project-name')"
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col>
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-x
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  :label="$t('start-date')"
                  prepend-icon="mdi-event"
                  readonly
                  :value="startDateDisp"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDateVal"
                :locale="$i18n.locale"
                :min="minDate"
                :max="maxDate"
                no-title
                @input="startDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu
              v-model="endDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  :label="$t('end-date')"
                  prepend-icon="mdi-event"
                  readonly
                  :value="endDateDisp"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDateVal"
                :locale="$i18n.locale"
                :min="minDate"
                :max="maxDate"
                no-title
                @input="endDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="description"
              rows="3"
              :placeholder="$t('description')"
            >
            </v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>{{$t('members')}}
                <v-spacer></v-spacer>
                <v-dialog v-model="allMemberDialog" max-width="50%">
                  <template #activator="{on, attrs}">
                <v-btn icon v-bind="attrs" v-on="on" @click="loadAllMember">
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
              </template>
                <v-card>
                  <v-card-title>{{$t('members')}}</v-card-title>
                  <v-data-table
                    v-model="allMemberTableSelected" 
                    :items="allMembers" :headers="allMemberTableHeader"
                    show-select
                    :loading="allMemberLoading">

                  </v-data-table>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="onAppendMember">{{$t('append')}}</v-btn>
                    <v-btn @click="() => {allMemberTableSelected = [];allMemberDialog = false}">{{$t('close')}}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              </v-card-title>
            <v-data-table :items="members" :headers="memberTableHeader">

            </v-data-table>
          </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn class="mr-4" type="submit" :disabled="invalid">
              {{$t('submit')}}
            </v-btn>
            <v-btn @click="clear">{{$t('clear')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </form>
  </validation-observer>
</template>
<script>
export default {
  components: {
    // ValidationProvider,
    // ValidationObserver,
  },
  data: (app) => ({
    projectName: '',
    firstName: '',
    lastName: '',
    email: '',
    description: '',
    loading: false,
    organizations: [],
    projects: [],
    members: [],
    allMembers: [],
    startDateMenu: false,
    startDateVal: null,
    endDateMenu: false,
    endDateVal: null,

    minDate: '2019-07-04',
    maxDate: '2099-08-30',
    memberTableHeader: [
      { text: app.$t('name'), value: 'name'}
    ],
    allMemberLoading: false,
    allMemberDialog: false,
    allMemberTableHeader: [
      { text: app.$t('name'), value: 'name'}
    ],
    allMemberTableSelected: []
  }),
  computed: {
    startDateDisp() {
      return this.startDateVal
      // format date, apply validations, etc. Example below.
      // return this.fromDateVal ? this.formatDate(this.fromDateVal) : "";
    },
    endDateDisp() {
      return this.endDateVal
      // format date, apply validations, etc. Example below.
      // return this.fromDateVal ? this.formatDate(this.fromDateVal) : "";
    },
  },
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
    this.projects = await this.projectRepository.findBy(
      'memberId',
      this.memberId
    )
    console.log(this.projects)
  },
  methods: {
    async loadAllMember () {
      this.allMemberLoading = true
      const allMembers = await this.memberRepository.findAll()
      this.allMembers = allMembers
      this.allMemberLoading = false
    },
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
    onAppendMember(e) {
      this.members = this.allMemberTableSelected
      this.allMemberTableSelected = []
      this.allMemberDialog = false
    }
  },
}
</script>
