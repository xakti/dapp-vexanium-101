<template>
    <div id="transfer" class="p-2">
        <Card class="drop-shadow md:w-1/2 mx-auto animate-zoomin">
            <template #title>
                <span>Transfer VEX</span>
            </template>
            <template #content>
                <div class="flex flex-col gap-2">
                    <FloatLabel variant="in">
                        <InputText id="receiver" fluid v-model="state.receiver"></InputText>
                        <label for="receiver">Penerima</label>
                    </FloatLabel>
                    <div>
                        <FloatLabel variant="in">
                            <InputText id="quantity" fluid inputmode="numeric" v-model="state.quantity"></InputText>
                            <label for="quantity">Jumlah</label>
                        </FloatLabel>
                        <Message severity="info" class="mt-2" size="small">Saldo: {{ state.balance }}</Message>
                    </div>
                    <FloatLabel variant="in">
                        <InputText id="memo" fluid v-model="state.memo"></InputText>
                        <label for="memo">Memo</label>
                    </FloatLabel>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end">
                    <Button :loading="state.loading" @click="send" label="Kirim"></Button>
                </div>
            </template>
        </Card>
    </div>
</template>
<script setup>
import {onActivated, reactive} from "vue";
import {useToast} from "primevue";
import Store from "@/js/store.js";
import {Action, Asset} from "@wharfkit/antelope";

const toast = useToast();
const token = reactive({contract: "vex.token", symbol: "VEX"});
const state = reactive({receiver: "", quantity: "", memo: "", loading: false, balance: "0.0000 VEX"});
let balance;

onActivated(() => {
    fetchBalance();
});

async function fetchBalance() {
    const name = Store.account.value.split("@")[0];
    try {
        const res = await Store.client.v1.chain.get_currency_balance(token.contract, name, token.symbol);
        let bal = res[0];
        if (bal && bal.value > 0) {
            state.balance = `${bal.value} ${bal.symbol.name}`;
            balance = bal;
        } else {
            balance = Asset.fromString("0.0000 VEX");
        }
    } catch (e) {
        toast.add({severity: "error", life: 3000, summary: "Gagal membaca saldo"});
    }
}

async function send() {
    const from = Store.session.actor;
    const to = state.receiver.trim().toLowerCase();
    let quantity = Asset.from("0.0000 VEX");
    let amount = parseFloat(state.quantity);

    if (to.length === 0) {
        toast.add({severity: "error", life: 3000, summary: "Masukkan alamat penerima"});
        return;
    }
    if (amount === 0 || isNaN(amount)) {
        toast.add({severity: "error", life: 3000, summary: "Masukkan jumlah dengan benar"});
        return;
    }
    if (amount > balance.value) {
        toast.add({severity: "error", life: 3000, summary: "Saldo kamu tidak cukup"});
        return;
    }

    quantity.units = quantity.symbol.convertFloat(amount);
    const data = {from, to, quantity, memo: state.memo};
    state.loading = true;
    try {
        const abi = await Store.abiCache.getAbi(token.contract);
        const action = Action.from({
            account: token.contract, name: "transfer", data,
            authorization: [Store.session.permissionLevel]
        }, abi);
        /**
         * @type {SendTransactionResponse}
         */
        const res = await Store.session.transact({action});
        console.log(res.transaction_id);

        state.loading = false;
        state.receiver = "";
        state.quantity = "";
        state.memo = "";
        toast.add({severity: "success", life: 3000, summary: "Transfer Berhasil"});
    } catch (e) {
        state.loading = false;
        toast.add({severity: "error", life: 3000, summary: "Transfer Gagal", detail: e.message});
    }
}

</script>

