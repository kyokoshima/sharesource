<template>
  <data-table
:repository-name="repositoryName" :fields="fields"
    new-item-title="New Member"
    :create-new-item-handler="createNewItemHandler"
    title='Members'
  >
  </data-table>
</template>
<script>
  export default {
    data() {
      return {
        repositoryName: "member",
        fields: [
          { name: "name", label: "name"},
        ]
      }
    },
    methods: {
      createNewItemHandler(e) {
        this.$router.push('/members/new')
      }
    }
  }
</script>
