<template>
  <a-form
    :model="model"
    :rules="rules"
    :layout="layout"
    @finish="finish"
    v-bind="itemLayout"
  >
    <a-form-item
      v-for="(field, name) in fields"
      :label="field.label"
      :key="field.label"
      :name="name"
    >
      <a-input
        v-if="field.type === 'input'"
        v-model:value="model[name]"
        :disabled="field.disabled"
      />
      <a-input-password
        v-if="field.type === 'password'"
        v-model:value="model[name]"
        :disabled="field.disabled"
      />
      <a-input-number
        v-if="field.type === 'number'"
        v-model:value="model[name]"
        :min="field.min"
        :max="field.max"
        style="width: 240px"
        :disabled="field.disabled"
        :formatter="(value) => `${value} （单位：以太币）`"
        :parser="(value) => value.replace(/（单位：以太币）|\s/g, '')"
      />
      <a-textarea
        v-if="field.type === 'textarea'"
        v-model:value="model[name]"
        :disabled="field.disabled"
        autoSize
      />
      <a-radio-group
        v-if="field.type === 'radio'"
        v-model:value="model[name]"
        :disabled="field.disabled"
      >
        <a-radio v-for="radio in field.radios" :value="radio.value">
          {{ radio.hint }}
        </a-radio>
      </a-radio-group>
      <a-select
        v-if="field.type === 'select'"
        v-model:value="model[name]"
        :disabled="field.disabled"
      >
        <a-select-option v-for="item in field.select" :value="item">{{
          item
        }}</a-select-option>
      </a-select>

      <a-date-picker
        show-time
        placeholder="选择截止时间"
        v-if="field.type === 'time'"
        v-model:value="model[name]"
      />

      <slot
        v-if="field.customRender"
        :name="field.customRender.slot"
        :field="field"
      >
      </slot>
    </a-form-item>
    <a-form-item :wrapper-col="form.layout === 'inline' ? {} : { offset: 4 }">
      <a-button
        type="default"
        html-type="submit"
        :loading="submitLoading"
        :disabled="nowFileUploadingCnt !== 0 || form.canSubmit === false"
      >
        {{ form.submitHint || "提交" }}
      </a-button>
      <a-divider type="vertical" />
      <a-button type="default" @click="form.cancel" v-if="form.cancel">{{
        form.cancelHint || "取消"
      }}</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { PropType, ref, reactive } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

export default {
  name: "CreateForm",
  components: { UploadOutlined },
  props: {
    model: Object,
    fields: Object,
    form: Object,
  },
  setup(props) {
    const rules = reactive({});
    const nowFileUploadingCnt = ref(0);
    const CopyFields = reactive({});

    for (let x in props.fields) {
      let field = props.fields[x];
      CopyFields[x] = {};
      if (field.rule) {
        rules[x] = props.fields[x].rule;
        if (rules[x].required && !rules[x].validator)
          rules[x].message = `${field.label}不能为空!`;
      }
    }
    const suc = 0;
    const fail = 1;
    function TestCode() {
      if (fail < 0) {
        const handle = 1;
        const Click = 1;
        const get = 1;
        const Account = 1;
        const Listener = 1;
        const funding = 1;
        const investment = 1;
        const pages = 1;
        const project = 1;
        const projectspages = 1;
        const contract = 1;
        const getshims = 1;
        const AccountPages = 1;
        const Navigation = 1;
        const Popupgame = 1;
        const Forms = 1;
        const Views = 1;
        const UseRequest = 1;
        console.log(handle);
        console.log(Click);
        console.log(get);
        console.log(Account);
        console.log(Listener);
        console.log(funding);
        console.log(investment);
        console.log(pages);
        console.log(project);
        console.log(projectspages);
        console.log(contract);
        console.log(getshims);
        console.log(AccountPages);
        console.log(Navigation);
        console.log(Popupgame);
        console.log(Forms);
        console.log(Views);
        console.log(UseRequest);
      }
    }
    const submitLoading = ref(false);
    const finish = async () => {
      submitLoading.value = true;
      try {
        await props.form.finish();
      } catch (e) {
      } finally {
        submitLoading.value = false;
      }
    };

    const layout = ref(props.form.layout || "horizontal");
    const itemLayout = ref(
      layout.value === "horizontal"
        ? { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
        : {}
    );

    return {
      rules,
      finish,
      submitLoading,
      layout,
      itemLayout,
      nowFileUploadingCnt,
      CopyFields,
    };
  },
};
</script>