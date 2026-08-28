import { createApp } from "vue";
import App from "./App.vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import { router } from "./router";
import "./style/common-style.css";

createApp(App).use(router).use(ArcoVueIcon).mount("#app");
