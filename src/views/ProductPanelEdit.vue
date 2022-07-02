<template>
<b-card-group deck>
    <h2>View/Edit product</h2> 

    <div>
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
              :state="nameState"
              @click="nameState=null"
            ></b-form-input>

            <b-form-invalid-feedback id="input-group-1-feedback">
              <div v-for="(error, index) in nameError" :key="index">
                {{ error }} 
              </div>
            </b-form-invalid-feedback>
          </b-form-group>
          

          <b-form-group id="input-group-2" label="Description:" label-for="input-2">
            <b-form-textarea
              id="input-2"
              v-model="product.description"
              placeholder="Description"
              required
              rows="3"
              :state="descriptionState"
              @click="descriptionState=null"
            ></b-form-textarea>

            <b-form-invalid-feedback id="input-group-2-feedback">
              <div v-for="(error, index) in descriptionError" :key="index">
                {{ error }} 
              </div>
            </b-form-invalid-feedback>
          </b-form-group>
          

          <b-form-group id="input-group-3" label="Price:" label-for="input-3">
            <b-form-input
              id="input-3"
              v-model.number="price"
              type="number"
              min="0"
              :state="priceState"
              @click="priceState=null"
            >
            </b-form-input>
            
            <b-form-invalid-feedback id="input-group-3-feedback">
              <div v-for="(error, index) in priceError" :key="index">
                {{ error }} 
              </div>
            </b-form-invalid-feedback>
            
            <b-button @click="addPrice">
                Add price
            </b-button>

            <b-card >
            <b-list-group>
                <b-list-group-item v-for="(price, index) in product.salary" :key="index">
                    {{ price }}        
                    <b-button variant="danger" @click="deletePrice(index)" :key="index"><b-icon icon="trash" aria-hidden="true"></b-icon></b-button>
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
  name: 'ProductPanelEdit',
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
      price: null,
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      nameState: null,
      nameError: 'Error',
      descriptionState: null,
      descriptionError: 'Error',
      priceState: null,
      priceError: 'Error',
    }
  },
  methods: {
    onSubmit(event) {
        event.preventDefault();
        this.putProductData(this.$route.params.id, this.product);

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
    putProductData: function(id, product) {
        UserService.putProductData(id, {
            name: product.name,
            description: product.description,
            salary: product.salary,
        }).then(
        response => {
          this.showAlert();
          response
        },
        error => {
          if(error.response.data.errors.name) {
            this.nameState = false;
            this.nameError = error.response.data.errors.name;
          }
          if(error.response.data.errors.description) {
            this.descriptionState = false;
            this.descriptionError = error.response.data.errors.description;
          }
          if(error.response.data.errors.salary) {
            this.priceState = false;
            this.priceError = error.response.data.errors.salary;
          }
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
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    }
  },
  mounted() {
    this.getProductData(this.$route.params.id);
  },
}
</script>