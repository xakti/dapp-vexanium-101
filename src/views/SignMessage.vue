<template>
    <div id="sign" class="p-2">
        <div class="flex flex-col gap-2 mx-auto md:w-1/2">
            <Textarea rows="5" v-model="content"></Textarea>
            <ScrollPanel>
                <span>{{ signature }}</span>
            </ScrollPanel>
            <Button :loading="loading" label="Sign" @click="doSign"></Button>
        </div>
    </div>
</template>
<script setup>

import {ref} from "vue";
import {useToast} from "primevue";
import {Signature} from "@wharfkit/antelope";
import Store from "../js/store.js";

const toast = useToast();
const content = ref();
const signature = ref("?");
const loading = ref(false);

async function doSign() {
    if (!Store.isWalletConnected()) {
        toast.add({life: 3000, severity: "error", summary: "Wallet belum tersambung"});
        return;
    }
    loading.value = true;
    try {
        /**
         *
         * @type {Signature}
         */
        const sign = await Store.session.signMessage(content.value);
        signature.value = sign.toString();
        loading.value = false;
    } catch (e) {
        loading.value = false;
        toast.add({life: 4000, severity: "error", summary: e.message});
    }
}

</script>

