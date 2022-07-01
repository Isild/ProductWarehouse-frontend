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

        <template #cell(delete)="data">
          <div class="form-group">
            <b-button variant="danger" @click="deleteItem(data.item.id)">Delete</b-button>
          </div>
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
        {
          key: 'delete',
          sortable: false
        },
      ]
    };
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    getAllData: function() {
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
    },
    deleteItem: function(id) {
        console.log('delete', id);
        this.$confirm("Are you want to delete this product?").then(() => {
          console.log('delete go', id);
          UserService.deleteProductData(id).then(
            response => {
              this.getAllData();
            },
            error => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        });
    },
    
  },

};
</script>
