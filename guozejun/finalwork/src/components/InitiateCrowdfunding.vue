<template>
  <div>
    <v-text-field
      v-model="project_abstract"
      label="众筹项目描述"
      :rules="rules"
    ></v-text-field>

    <v-text-field
    v-model="project_description"
      label="众筹项目介绍"
      :rules="rules"
    ></v-text-field>

    <v-text-field
    v-model="rise_amount"
      label="众筹金额目标"
      :rules="rules1"
    ></v-text-field>

    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-date-picker
          v-model="dates"
          range
        ></v-date-picker>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="dateRangeText"
          label="Date range"
          prepend-icon="mdi-calendar"
          readonly
        ></v-text-field>
        model: {{ dates }}
      </v-col>
    </v-row>
    <v-btn
      depressed
      v-on:click="upload_form"
    >
      提交
    </v-btn>
  </div>

</template>

<script>
  var getNowFormatDate = function () {
    var  date =  new  Date();
    var  seperator1 =  "-" ;
    var  year = date.getFullYear();
    var  month = date.getMonth() + 1;
    var  strDate = date.getDate();
    if  (month >= 1 && month <= 9) {
      month =  "0"  + month;
    }
    if  (strDate >= 0 && strDate <= 9) {
      strDate =  "0"  + strDate;
    }
    var  currentdate = year + seperator1 + month + seperator1 + strDate;
    return  currentdate;
  };
  export default {
      name: 'InitiateCrowdfunding',
      data: () => ({
        project_abstract: "",
        project_description: "",
        rise_amount: 0,
        rules: [
          value => !!value || '不能为空！',
        ],
        rules1: [
          value => !!value || '不能为空！',
          value => {
            const integer = /^\+?[1-9][0-9]*$/
            const float = /^[+-]?((0|([1-9]\d*))\.\d+)?$/
            return (integer.test(value) || float.test(value)) || "必须是一个数字"
          },
        ],
        dates: [getNowFormatDate(), getNowFormatDate()],
      }),
      methods: {
        upload_form: function() {
          var input_form = {
            abstract : this.project_abstract,
            description : this.project_description,
            amout : this.rise_amount,
            date : this.dates,
          };
          alert(JSON.stringify(input_form))
        }
      },
      computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
  }
</script>