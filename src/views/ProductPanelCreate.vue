<template>
<b-card-group deck>
    <h2>Add new product</h2> 
    <div>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="input-group-1"
            label="Name:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="product.name"
              placeholder="Name"
              required
            ></b-form-input>
          </b-form-group>
          

          <b-form-group id="input-group-2" label="Description:" label-for="input-2">
            <b-form-textarea
              id="input-2"
              v-model="product.description"
              placeholder="Description"
              required
              rows="3"
            ></b-form-textarea>
          </b-form-group>
          

          <b-form-group id="input-group-3" label="Price:" label-for="input-3">
            <b-form-input
              id="input-3"
              v-model.number="price"
              type="number"
              min="0"
            >
            </b-form-input>
            
            <b-button @click="addPrice">
                Add price
            </b-button>

            <b-card >
            <b-list-group>
                <b-list-group-item v-for="(price, index) in product.salary" :key="index">
                    {{ price }}        
                    <b-button variant="danger" @click="deletePrice(index)" :key="index">Delete</b-button>
                </b-list-group-item>
            </b-list-group>

            </b-card>

          </b-form-group>

          <b-button type="submit" variant="primary">Save</b-button> 
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
    </div>
    </b-card-group>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'ProductPanelCreate',
  props: {
    msg: String
  },
  data() {
    return {
      product: {
        id: null,
        name: '',
        description:'',
        salary: [],
      },
      show: true,
      price: null
    }
  },
  methods: {
    onSubmit(event) {
        event.preventDefault();
        this.postProductData(this.product);
    },
    onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.product.name = ''
        this.product.description = ''
        this.product.salary = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
        this.getProductData(this.$route.params.id);
    },
    postProductData: function(product) {
        UserService.postProductData({
            name: product.name,
            description: product.description,
            salary: product.salary,
        }).then(
        response => {
          response;
          console.log(response.data);
          this.$router.push('/products/' + response.data.id);
        },
        error => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    },
    getProductData: function(id) {
      UserService.getProductData(id).then(
        response => {
          this.product.id = response.data.id;
          this.product.name = response.data.name;
          this.product.description = response.data.description;
          this.product.salary = response.data.salary;
        },
        error => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    },
    deletePrice: function(index) {
        this.$delete(this.product.salary,index);
    },
    addPrice: function() {
        if(typeof this.price == 'number'){
          this.product.salary.push(this.price);
        }
        this.price = null;

        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
    }
  },
  mounted() {
    this.getProductData(this.$route.params.id);
  },
}
</script>