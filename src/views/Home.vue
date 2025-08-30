<template>
    <div id="home" class="p-2">
        <div class="border border-surface rounded-xl shadow-md flex flex-col gap-2 p-2 mx-auto md:w-1/2">
            <span class="font-bold text-2xl mb-4 text-center">
                DApp Vexanium 101
            </span>
            <div v-if="Store.account.value.length > 0" class="inline-flex items-center gap-2 mx-auto">
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

import {IdentityProof} from "@wharfkit/signing-request";
import {useToast} from "primevue";
import {Herlina} from "herlina-kit";
import {useRouter} from "vue-router";
import Store from "../js/store.js";

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
    let walletUrl = `https://herlina.web.app/login?vsr=${login}`;
    popupWindow(walletUrl, "Vexanium Wallet", 360, 600);
}

function doLogin() {
    if (!Store.herlina) initHerlina();

    // buat login request, vsr ini juga bisa untuk kode qr
    const vsr = Store.herlina.createLoginRequest("DApp Vexanium 101", "https://infraxakti.web.app/icon-128.png");
    // sambungkan aplikasi ke signal server
    Store.herlina.connect();
    // buka wallet di jendela baru
    openWallet(vsr);
}

function initHerlina() {
    const herlina = new Herlina();
    herlina.on("error", onServerError);
    herlina.on("session", onSession);
    Store.herlina = herlina;
}

function onServerError(error) {
    console.log(error.message);
    toast.add({life: 4000, severity: "error", summary: "Koneksi Server Error", detail: error.message});
}

/**
 *
 * @param {WalletSession} session
 * @param {IdentityProof} proof
 */
async function onSession(session, proof) {
    console.log("tersambung dengan wallet");

    if (proof && proof instanceof IdentityProof) {
        // verifikasi akun
        const account = await Store.client.v1.chain.get_account(proof.signer.actor);
        if (proof.verify(account.getPermission(proof.signer.permission).required_auth)) {
            Store.account.value = proof.signer.actor.toString();
            toast.add({life: 3000, severity: "success", summary: `Tersambung dengan ${proof.signer.actor.toString()}`});
        } else {
            toast.add({life: 4000, severity: "error", summary: "Gagal verifikasi akun"});
            Store.herlina.destroy();
            Store.herlina = undefined;
            return;
        }
    } else {
        // login dari session terakhir
        Store.account.value = session.actor.toString();
        toast.add({life: 3000, severity: "success", summary: `Tersambung dengan ${session.actor.toString()}`});
    }

    session.setABICache(Store.abiCache);
    session.onClose(onClose);
    Store.session = session;
    // sudah tersambung dengan wallet
    // putuskan signal server
    Store.herlina.disconnect();
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

