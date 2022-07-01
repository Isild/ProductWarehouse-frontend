<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>
      <b-table 
        striped hover 
        :items="products" 
        :fields="fields"
        :per-page="0"
        :current-page="currentPage"
        >

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
            <b-button variant="danger" @click="deleteItem(data.item.id)"> Delete</b-button>
          </div>
        </template>

      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        align="center"
        @page-click="reloadDataPaginator"
      ></b-pagination>

    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';
export default {
  name: 'HomeMy',
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      rows: 1,
      content: '',
      sortBy: 'id', 
      orderBy: 'asc',
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
    this.getAllData(this.perPage, this.currentPage, this.sortBy, this.orderBy);
  },
  methods: {
    getAllData: function(perPage, currentPage, sortBy, orderBy, search) {
      UserService.getProductsData(perPage, currentPage, sortBy, orderBy, search).then(
        response => {
          this.products = response.data.data;
          this.perPage = response.data.per_page;
          this.currentPage = response.data.current_page;
          this.rows = response.data.total;
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
        this.$confirm("Are you want to delete this product?").then(() => {
          UserService.deleteProductData(id).then(
            response => {
              response;
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
    reloadDataPaginator: function(event, pageNumber) {
      // this.currentPage = pageNumber;
      this.getAllData(this.perPage, pageNumber, this.sortBy, this.orderBy);
    },
  },
  computed: {
    // rows() {
    //   return this.products.length
    // }
  }
};
</script>
