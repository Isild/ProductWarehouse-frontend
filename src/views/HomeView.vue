<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>
      <b-table striped hover :items="products" :fields="fields">
        <template #cell(id)="data">
          <a :href="`${'/products/' + data.value}`">{{data.value}}</a>
        </template>
        
        <template #cell(salary)="data">
          <li v-for="(salary, index) in data.value" :key="index">
            {{ salary }}
          </li>
        </template>
      </b-table>
    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';
export default {
  name: 'HomeMy',
  data() {
    return {
      content: '',
      products: [],
      fields:[
        {
          key: 'id',
          sortable: true
        },
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'description',
          sortable: false
        },
        {
          key: 'salary',
          sortable: false
        },
      ]
    };
  },
  mounted() {
    UserService.getProductsData().then(
      response => {
        this.products = response.data.data;
      },
      error => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  }
};
</script>
