<template>
    <div id="home" class="p-2">
        <div class="border border-surface rounded-xl shadow-md flex flex-col gap-2 p-2 mx-auto md:w-1/2">
            <span class="font-bold text-2xl mb-4 text-center">
                DApp Vexanium 101
            </span>
            <div v-if="Store.account.value.length > 0" class="inline-flex items-center gap-2">
                <Avatar icon="pi pi-user" size="large"/>
                <span class="font-bold">{{ Store.account }}</span>
            </div>
            <Button v-else label="Login" @click="doLogin"></Button>

            <Button label="Transfer VEX" @click="goTransfer"></Button>
            <Button label="Sign Message" as="router-link" to="/sign"></Button>
        </div>
    </div>
</template>
<script setup>

import {Herlina} from "herlina-kit";
import {useToast} from "primevue";
import {useRouter} from "vue-router";
import Store from "@/js/store.js";

const toast = useToast();
const router = useRouter();

function goTransfer() {
    if (!Store.isWalletConnected()) {
        toast.add({life: 3000, severity: "error", summary: "Wallet belum tersambung"});
        return;
    }
    router.push("/transfer");
}

function popupWindow(url, title, w, h) {
    const left = window.screen.width - w;
    const top = (window.screen.height - h) / 2;
    const features = `width=${w},height=${h},top=${top},left=${left},resizable=yes,scrollbars=yes`;
    return window.open(url, title, features);
}

function openWallet(vsr) {
    let login = vsr.split(":")[1]; // 'vsr:' dibuang
    let walletUri = `https://herlina.web.app/login?vsr=${login}`;
    popupWindow(walletUri, "Vexanium Wallet", 360, 600);
}

function doLogin() {
    if (!Store.herlina) initHerlina();

    const vsr = Store.herlina.createLoginRequest("DApp Vexanium 101", "https://karmila.web.app/favicon.png");
    // vsr ini juga bisa untuk kode qr

    openWallet(vsr); // buka di jendela baru
}

function initHerlina() {
    const herlina = new Herlina();
    herlina.on("error", onServerError);
    herlina.on("session", onSession);
    herlina.connect();
    Store.herlina = herlina;
}

function onServerError(error) {
    console.log(error.message);
    toast.add({life: 4000, severity: "error", summary: "Koneksi Error", detail: error.message});
}

/**
 *
 * @param {WalletSession} session
 * @param {IdentityProof} proof
 */
async function onSession(session, proof) {
    console.log("tersambung dengan wallet");

    // verifikasi
    const account = await Store.client.v1.chain.get_account(proof.signer.actor);
    if (proof.verify(account.getPermission(proof.signer.permission).required_auth)) {
        session.setABICache(Store.abiCache);
        session.onClose(onClose);
        Store.session = session;

        toast.add({life: 3000, severity: "success", summary: `tersambung dengan ${proof.signer.toString()}`});
        Store.account.value = proof.signer.toString();

        // sudah tersambung dengan wallet
        // putuskan signal server
        Store.herlina.disconnect();
    } else {
        toast.add({life: 4000, severity: "error", summary: "Gagal verifikasi akun"});
    }
}

function onClose() {
    console.log("terputus dengan wallet");

    Store.account.value = "";
    Store.herlina.destroy();
    Store.herlina = undefined;
    Store.session = undefined;
    toast.add({life: 4000, severity: "info", summary: "Terputus dengan wallet"});
}
</script>

