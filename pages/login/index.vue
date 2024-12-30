<script setup lang="ts">
const email = ref("");
const emailSendingStatus = ref<"not_sent" | "sending" | "sent" | "error">(
  "not_sent"
);
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const {
  public: { url },
} = useRuntimeConfig();

async function doLogin() {
  emailSendingStatus.value = "sending";
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: `${url}/dashboard`,
    },
  });
  if (error) {
    emailSendingStatus.value = "error";
    return;
  }
  emailSendingStatus.value = "sent";
}

onMounted(() => {
  if (user.value) {
    router.replace("/dashboard");
  }
});
</script>

<template>
  <div
    class="max-w-screen-xl mx-auto mt-[100px] flex items-center justify-center"
  >
    <div class="w-[400px] flex flex-col text-center">
      <template
        v-if="
          emailSendingStatus === 'not_sent' || emailSendingStatus === 'error'
        "
      >
        <div class="flex items-center justify-center mb-4">
          <i class="icon-mail me-5" />
          <span class="indie-flower-bold text-4xl">Tu email</span>
        </div>
        <p>Te enviaremos un enlace para acceder a tu panel de datos.</p>
        <div class="my-4 flex flex-col">
          <input
            name="email"
            type="email"
            v-model="email"
            placeholder="pepe@flores.com"
            class="py-3 px-5 border rounded"
            @keyup.enter="doLogin"
          />
          <small
            class="mt-2 text-sm text-red-500"
            v-if="emailSendingStatus === 'error'"
            >Ha ocurrido un error. Revisa que el correo es válido.</small
          >
        </div>
        <button
          @click="doLogin"
          :disabled="!email"
          type="button"
          class="flex items-center p-3 border border-slate-400 rounded-lg text-center justify-center hover:bg-slate-200"
          :class="{ 'opacity-60 cursor-not-allowed': !email }"
        >
          <i class="icon-paperplane me-2" />
          <span>Enviar enlace</span>
        </button>
      </template>
      <template v-else-if="emailSendingStatus === 'sending'">
        <div class="flex items-center justify-center mb-4">
          <i class="icon-mail me-5" />
          <span class="indie-flower-bold text-4xl">Enviando...</span>
        </div>
        <p>¡En breve recibirás un correo!</p>
      </template>
      <template v-else>
        <div class="flex items-center justify-center mb-4">
          <i class="icon-mail me-5" />
          <span class="indie-flower-bold text-4xl">Revisa tu correo</span>
        </div>
        <p>Te hemos enviado un enlace. ¡Revisa tu carpeta de spam!</p>
      </template>
    </div>
  </div>
</template>
