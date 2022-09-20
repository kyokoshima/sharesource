<template>
  <data-table :repository-name="repositoryName" :fields="fields"
    newItemTitle="New Organization"
    title='Organizations'
  >

  </data-table>
</template>
<script>
  export default {
    data() {
      return {
        repositoryName: "organization",
        fields: [
          { name: "name", label: "name"},
        ]
      }
    },
  }
</script>
