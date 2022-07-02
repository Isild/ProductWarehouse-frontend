<template>
  <div class="container">
    <header class="jumbotron">
      
      <b-alert
        :show="dismissCountDown"
        dismissible
        wariant="success"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >
        <p><b-icon icon="check-circle" aria-hidden="true"></b-icon> Success</p>
        <b-progress
          variant="success"
          :max="dismissSecs"
          :value="dismissCountDown"
          height="4px"
        ></b-progress>
      </b-alert>

      <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
        {{ error }}
      </b-alert>

      <b-container fluid>
        <b-row>
          <b-col >
            <h6>Limit 
              <b-form-select v-model="perPage" :options="options" size="sm" class="mt-3" @change="reloadDataPaginator"></b-form-select>
            </h6>
          </b-col>

          <b-col sm="3"></b-col>

          <b-col sm="3" inline>
            <b-input-group class="mt-3">
              <b-form-input :id="search" :type="search" placeholder="Search" v-model="search"></b-form-input>

              <b-input-group-append>
                <b-button variant="info" @click="searchFunction">
                  <b-icon icon="search" aria-hidden="true"></b-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>

      <b-table 
        striped hover 
        :items="products" 
        :fields="fields"
        :per-page="0"
        :current-page="currentPage"
        >

        <template #cell(id)="data">
          <a :href="`${'/products/' + data.value}`" v-if="currentUser">{{data.value}}</a>
          <a v-if="!currentUser">{{data.value}}</a>
        </template>
        
        <template #cell(salary)="data">
          <li v-for="(salary, index) in data.value" :key="index">
            {{ salary }}
          </li>
        </template>

        <template v-if="currentUser" #cell(delete)="data">
          <div class="form-group">
            <b-button variant="danger" @click="deleteItem(data.item.id)"><b-icon icon="trash" aria-hidden="true"></b-icon></b-button>
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
      search: '',
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
      ],
      product: {
        id: null,
        name: '',
        description:'',
        salary: [],
      },
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      user: null,
      options: [
        { value: 5, text: "5" },
        { value: 10, text: "10" },
        { value: 15, text: "15" },
        { value: 20, text: "20" },
        { value: 30, text: "30" },
        { value: 40, text: "40" },
        { value: 50, text: "50" },
      ],
      error: "Error",
    };
  },
  mounted() {
    this.getAllData(this.perPage, this.currentPage, this.sortBy, this.orderBy);
  },
  beforeMount() {
    if(this.currentUser) {
      this.fields.push(
        {
          key: 'delete',
          sortable: false,
        },
      );
    }
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
          this.error = error.response.data.errors;
          this.showDismissibleAlert = true;
        }
      );
    },
    deleteItem: function(id) {
        this.$confirm("Are you want to delete this product?").then(() => {
          UserService.deleteProductData(id).then(
            response => {
              response;
              this.getAllData(this.perPage, this.currentPage, this.sortBy, this.orderBy);
            },
            error => {
              this.error = error.response.data.errors;
              this.showDismissibleAlert = true;
            }
          );
        });
    },
    reloadDataPaginator: function(event, pageNumber) {
      // this.currentPage = pageNumber;
      this.getAllData(this.perPage, pageNumber, this.sortBy, this.orderBy);
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    searchFunction: function(){
      this.getAllData(this.perPage, 1, this.sortBy, this.orderBy, this.search);
    },
  },
  computed: {
    // rows() {
    //   return this.products.length
    // }
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
};
</script>
