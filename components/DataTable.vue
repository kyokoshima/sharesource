<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    loading-text="Loading..."
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        
        <v-btn v-if="createNewItemHandler"
              color="primary"
              dark
              class="mb-2"
              @click="createNewItemHandler"
            >
              {{ formTitle }}
            </v-btn>
        <v-dialog v-else
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              {{ formTitle }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text v-for="field in fields" :key="field.name">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem[field.name]"
                      :label=field.label
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>


  export default {
    props: {
      repositoryName: String,
      fields: Array,
      title: String,
      newItemTitle: {
        type: String,
        default: 'New Item'
      },
      createNewItemHandler: Function
    },
    data() {
      return {
        dialog: false,
        dialogDelete: false,
        // headers,
        items: [],
        loading: false,
        editedItem: {},
        defaultItem: {},
        // headers: [],
        editedIndex: -1,
        repository: null
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? this.newItemTitle : 'Edit Item'
      },
      headers () {
        const columns = this.fields.map((e) => { return { text: e.name, value: e.name}})
        return [...columns, {text: "Actions", value: "actions", sortable: false, width: '10%', align: 'right'}]
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created() {
     
      this.repository = this.$repositories(this.repositoryName)
      const defaultItem = Object.assign({}, ...this.fields.map((v) => ({ [v.name] : '' })))
      this.defaultItem = defaultItem
      this.editedItem = defaultItem
    },

    async mounted() {
      
      this.loading = true
      // console.log(this.repository)
      this.items = await this.repository.findAll()
      this.loading = false
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      async deleteItemConfirm () {
       
        const result = await this.repository.delete(this.editedItem.id)
        this.items.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          this.items.push(this.editedItem)
        }
        this.repository.upsert(this.editedItem)
        this.close()
      },
    }
  }
</script>
