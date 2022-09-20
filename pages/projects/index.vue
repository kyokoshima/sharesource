<template>
  <data-table
:repository-name="repositoryName" :fields="fields"
    new-item-title="New Project"
    title='Projects'
    :create-new-item-handler="createNewItemHandler"
  >

  </data-table>
</template>
<script>
  export default {
    data() {
      return {
        repositoryName: "project",
        fields: [
          { name: "name", label: "name"},
        ]
      }
    },
    methods: {
      createNewItemHandler(e) {
        this.$router.push('/projects/new')
      }
    }
  }
</script>
