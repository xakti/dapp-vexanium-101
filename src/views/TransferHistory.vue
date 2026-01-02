<template>
	<div id="transfer-history" class="p-2">
		<div class="border border-surface rounded-xl shadow-md flex flex-col gap-2 p-2 md:mx-auto md:w-1/2">
			<form @submit.prevent="fetchActions">
				<InputGroup>
					<FloatLabel variant="in">
						<AutoComplete id="account" fluid v-model="state.account" :delay="700"
						              :suggestions="suggestions.account"
						              @complete="completeAccount" @itemSelect="fetchActions"></AutoComplete>
						<label for="account">Nama Akun</label>
					</FloatLabel>
					<InputGroupAddon>
						<Button type="submit" text icon="pi pi-search" :loading="state.loading"></Button>
					</InputGroupAddon>
				</InputGroup>
			</form>
		</div>

		<div class="mt-2 p-1 border border-surface rounded-xl shadow-md lg:w-3/5 md:mx-auto">
			<DataTable :value="state.actions" size="small" scrollable scroll-height="525px"
			           resizable-columns column-resize-mode="expand">
				<Column header="TX">
					<template #body="{data}">
						<a :href="`https://karmila.web.app/transaction/${data.transaction_id}`" target="_blank"
						   class="text-primary-400">
							{{ data.transaction_id.slice(0, 8) }}
						</a>
					</template>
				</Column>
				<Column header="From" field="data.from"></Column>
				<Column header="Quantity" field="data.quantity"></Column>
				<Column header="Memo" field="data.memo"></Column>
				<Column header="Date">
					<template #body="{data}">
						<span>{{ DateTime.fromISO(data.timestamp + 'Z').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) }}</span>
					</template>
				</Column>
				<template #empty>
					<span>belum ada riwayat transfer</span>
				</template>
			</DataTable>
		</div>
	</div>
</template>

<script setup>


import {onActivated, reactive} from "vue";
import Store, {wind} from "../js/store.js";
import {DateTime} from "luxon";
import {completeAccount, suggestions} from "../js/auto.js";

const state = reactive({account: "indodaxvexan", actions: [], loading: false});

onActivated(() => {
	if (Store.isWalletConnected()) {
		state.account = Store.account.value;
	}
	fetchActions();
});


async function fetchActions() {
	const url = `${wind}/v2/history/get_actions`;
	const params = new URLSearchParams();
	const account = state.account.toLowerCase();
	params.set("simple", "true");
	params.set("noBinary", "true");
	params.set("filter", "vex.token:transfer"); // token VEX
	params.set("account", account);
	params.set("@transfer.to", account); // baca transfer masuk ke akun ini
	params.set("limit", "40");

	state.loading = true;
	try {
		const res = await fetch(`${url}?${params.toString()}`, {headers: {"Content-Type": "application/json"}});
		if (res.ok) {
			const json = await res.json();
			state.actions = json.simple_actions;
		}
	} catch (e) {
	} finally {
		state.loading = false;
	}
}
</script>


