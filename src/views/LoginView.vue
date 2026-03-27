<script setup>
import { useAuthStore } from '@/stores/auth'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import GoogleLoginButton from '@/components/GoogleLoginButton.vue'

const toast = useToast();

const router = useRouter()
const auth = useAuthStore()
const form = reactive({
    email: '',
    password: ''
})

const submitLogin = async () => {
    try {
        const data = await auth.login(form.email, form.password)
        router.push({ name: 'home' })
    } catch (error) {

        toast.add({
            severity: 'error', // 'success', 'info', 'warn', 'error'
            summary: 'Error',
            detail: 'Credenciales incorrectas',
            life: 4000 // Duración en ms
        })
    }
}

const googleLogin = async (token) => {
    try {
        console.log(token)
        const data = await auth.loginGoogle(token)
        router.push({ name: 'home' })
    } catch (error) {
        if (error.code == 404) {
            toast.add({
                severity: 'error', // 'success', 'info', 'warn', 'error'
                summary: 'Error',
                detail: 'Este correo no está registrado',
                life: 4000 // Duración en ms
            })
        }
        console.error(error)
    }
}

</script>

<template>
    <div class="flex flex-row overflow-hidden">
        <!-- Engineering Faculty picture -->
        <div class="flex h-[calc(100vh-7rem)] w-1/4">
            <img src="../assets/img/Home_Vertical.jpeg" alt="" class="w-full h-full object-cover">
        </div>

        <!-- Main view -->
        <div class="flex flex-row justify-center items-center gap-x-16 flex-grow">
            <!-- Log In container -->
            <div class="w-1/3 p-6 border-gray-300 border-2 rounded-xl shadow-xl bg-gray-100">
                <h2 class="text-center text-2xl font-bold text-gray-700 mb-8">Inicio de sesión</h2>

                <form @submit.prevent="submitLogin" class="flex flex-col gap-y-8">
                    <div class="flex flex-col">
                        <label for="email" class="text-gray-700 font-medium">Email:</label>
                        <input v-model="form.email" type="email" id="email" name="email"
                            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Enter your email" required>
                    </div>

                    <div class="flex flex-col">
                        <label for="password" class="text-gray-700 font-medium">Contraseña:</label>
                        <div class="flex flex-col gap-y-8">
                            <input v-model="form.password" type="password" id="password" name="password"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                placeholder="Enter your password" required>
    
                            <button type="submit"
                                class="bg-sky-600 text-white hover:bg-sky-500 px-6 py-2 rounded-lg font-bold shadow-md transition duration-300">
                                Iniciar sesión
                            </button>
                            
                        </div>
                    </div>
                </form>
                <GoogleLoginButton class="mt-4"
                    @success='googleLogin' />
            </div>

            <!-- Engineering Faculty logo & Description -->
            <div class="flex flex-col gap-y-8 items-center text-center px-6 max-w-md">
                <div class="flex flex-row items-center gap-x-4">
                    <div class="w-24 h-24">
                        <img src="../assets/img/FDI_Logo.png">
                    </div>
                    <div class="flex flex-col">
                        <div class="font-bold text-4xl text-sky-900">Facultad de</div>
                        <div class="font-bold text-4xl text-sky-900">Ingeniería</div>
                    </div>
                </div>
                <p class="text-xl text-justify text-gray-700 text-lg mt-4 max-w-xs">
                    Con <span class="font-semibold text-sky-600">Your Booking</span>, puedes reservar espacios de la
                    Facultad de Ingeniería fácilmente. Gestiona tus reservaciones y horarios de forma cómoda y edítalos cuando
                    quieras, hasta 24 horas antes de la fecha.
                </p>
            </div>
        </div>
        <Toast position="bottom-right"/>
    </div>
</template>