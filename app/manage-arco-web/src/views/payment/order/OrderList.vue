<script setup lang="ts">
import http, { searchParams } from "@/proxy/request";
import TitleHeader from "@/components/title/TitleHeader.vue";
import { h, onMounted, ref } from "vue";
import OrderStatus from "./OrderStatus.vue";
import OrderTypeSelect from "@/components/order/OrderTypeSelect.vue";
import UnixRangePicker from "@/components/unix-range-picker/UnixRangePicker.vue";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "编号",
    dataIndex: "bizId",
  },
  {
    title: "来源",
    dataIndex: "host",
  },
  {
    title: "平台",
    dataIndex: "platfrom",
  },
  {
    title: "用户ID",
    dataIndex: "userId",
  },
  {
    title: "金额",
    dataIndex: "amount",
    render: ({ record }: { record: any }) => `${record.currency} ${record.amount}`,
  },
  {
    title: "美元金额",
    dataIndex: "amount",
    render: ({ record }: { record: any }) => `USD ${record.dollar}`,
  },
  {
    title: "订单类型",
    dataIndex: "orderType",
    render: ({ record }: { record: any }) => record.orderType === 0 ? "订阅" : "金币",
  },
  {
    title: "订阅周期",
    dataIndex: "subscriptionPeriod",
  },
  {
    title: "订阅期数",
    dataIndex: "subscriptionCount",
  },
  {
    title: "支付渠道",
    dataIndex: "paymentChennel",
  },
  {
    title: "支付类型",
    dataIndex: "paymentType",
  },
  {
    title: "状态",
    dataIndex: "orderStatus",
    render: ({ record }: { record: any }) => h(OrderStatus, { status: record.orderStatus, statusName: record.orderStatusName })
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
];

const data = ref([]);
const pagination = ref({});
const loading = ref(true);

type OrderListRequest = {
  page: number;
  size: number;
  search: string;
  orderType: string;
  status: string;
  startDate: string;
  endDate: string;
}

const request = ref<OrderListRequest>({
  page: 1,
  size: 20,
  search: "",
  orderType: "",
  status: "",
  startDate: "",
  endDate: "",
});

onMounted(async () => {
  await handleSearch();
});

const handleSearch = async () => {
  loading.value = true;
  const result = await http.get(`/api/order/list?${searchParams(request.value)}`);
  data.value = result.data.list ?? [];
  pagination.value = {
    total: result.data.total ?? 0,
    current: result.data.page ?? 1,
    pageSize: result.data.size ?? 25,
  };
  loading.value = false;
}

</script>

<template>
  <title-header title="订单列表" />
  <a-form :model="request">
    <a-row :gutter="6">
      <a-col flex="260px">
        <a-form-item no-style>
          <a-input v-model="request.search" allow-clear placeholder="搜索订单ID/编号" />
        </a-form-item>
      </a-col>
      <a-col flex="260px">
        <a-form-item no-style>
          <order-type-select v-model="request.orderType" />
        </a-form-item>
      </a-col>
      <a-col flex="260px">
        <a-form-item no-style>
          <order-type-select />
        </a-form-item>
      </a-col>
      <a-col flex="260px">
        <a-form-item no-style>
          <unix-range-picker v-model:start="request.startDate" v-model:end="request.endDate" />
        </a-form-item>
      </a-col>
      <a-col flex="auto">
        <a-space :size="6">
          <a-button type="primary" shape="round" @click="handleSearch">查询</a-button>
          <a-button shape="round">高级筛选</a-button>
          <a-button shape="round">重置查询</a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-form>
  <div style="margin-top: 1.25rem"></div>
  <a-table :bordered="true" :columns="columns" :data="data" :loading="loading"
    :pagination="{ ...pagination, showPageSize: true, showJumper: true, showTotal: true }" />
</template>
