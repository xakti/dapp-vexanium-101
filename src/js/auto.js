import {reactive} from "vue";
import Store from "./store.js";

const suggestions = reactive({account: [], contract: [], producer: []});

async function findAccount(name) {
    let data = await Store.client.v1.chain.get_table_by_scope({
        code: "vexcore", table: "userres",
        lower_bound: name,
        limit: 7
    });

    suggestions.account = [];
    data.rows.forEach(it => {
        suggestions.account.push(it.scope.toString());
    });
}

function completeAccount(val) {
    let len = val.query.length;
    if (len > 0 && len <= 12) {
        findAccount(val.query.toLowerCase());
    }
}

export {suggestions, completeAccount};
