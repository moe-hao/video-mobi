<script setup lang="ts">
import { login } from "@/composables/auth/login";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loginAuthInfo = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  await login(loginAuthInfo.value);
  router.push("/dashboard/view");
};
</script>

<template>
  <div class="login-container">
    <div class="login-sidebar">
      <div class="sidebar-content">
        <h1 class="sidebar-title">Red BlinBlin</h1>
        <h1 class="sidebar-subtitle">后台管理工具</h1>
      </div>
    </div>

    <div class="login-main">
      <div class="login-form-wrapper">
        <div class="login-card">
          <h2 class="login-heading">管理后台用户登录</h2>
          <a-form :model="loginAuthInfo" @submit="handleLogin" layout="vertical">
            <a-form-item field="username">
              <a-input v-model="loginAuthInfo.username" placeholder="用户名" size="large" allow-clear />
            </a-form-item>
            <a-form-item field="password">
              <a-input-password v-model="loginAuthInfo.password" placeholder="密码" size="large" allow-clear />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit" size="large" long>登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
}

.login-sidebar {
  display: none;
  width: 20%;
  background: linear-gradient(to bottom right, #334155, #0f172a);
  align-items: center;
  justify-content: center;
}

@media (min-width: 1024px) {
  .login-sidebar {
    display: flex;
  }
}

.sidebar-content {
  text-align: center;
  color: white;
}

.sidebar-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.sidebar-subtitle {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.login-form-wrapper {
  width: 100%;
  max-width: 32rem;
  padding: 0 2rem;
}

.login-card {
  background: white;
  padding: 2rem;
  box-shadow: 1px rgba(0, 0, 0, 0.1);
}

.login-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}
</style>
