<template>
  <q-page class="q-pa-md">
    <q-card>
      <div class="row q-pa-md">
        <div class="col">
          <div class="text-h6">Cadastro de Respostas</div>
        </div>
        <div class="col-10">
          <q-btn icon="home" color="green" @click="moveTo()"
            ><q-tooltip>Voltar</q-tooltip></q-btn
          >
        </div>
      </div>

      <div class="row q-pa-md">
        <div class="col-md-3 col-xs-10">
          <q-input
            class="col-md-2 col-xs-10 q-mr-sm"
            bg-color="white"
            rounded
            outlined
            dense
            label="Buscar por CPF"
            mask="###.###.###-##"
            unmasked-value
            v-model.trim="cpf"
          >
            <template v-slot:prepend>
              <q-btn
                v-if="cpf"
                padding="none"
                flat
                rounded
                color="primary"
                icon="cancel"
                @click="metodoBuscarUsuariosTotal(), (cpf = '')"
              />
            </template>
            <template v-slot:append>
              <q-btn
                v-if="!buscarUsuariov"
                flat
                rounded
                color="primary"
                icon="search"
                @click="metodoBuscarUsuario()"
              />
              <q-btn
                v-else
                flat
                rounded
                color="primary"
                icon="research"
                @click="metodoBuscarUsuariosTotal()"
              />
            </template>
          </q-input>
        </div>
      </div>

      <q-separator />

      <q-card-section>
        <q-table
          title="Respostas Registradas"
          :rows="linhas"
          :columns="colunas"
          row-key="cpf"
          flat
          bordered
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                round
                outline
                dense
                color="negative"
                icon="delete"
                @click="metodoPerguntaSeDeleta(props.row.cpf)"
                ><q-tooltip>Deletar</q-tooltip></q-btn
              >
              <q-btn
                class="q-ml-sm"
                round
                outline
                dense
                color="orange"
                icon="edit_note"
                @click="metodoPerguntaSeEdita(props.row.cpf)"
                ><q-tooltip>Editar</q-tooltip></q-btn
              >
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showuserDialogEditar">
      <q-card>
        <q-card-section>
          <div class="text-h6">Altere o nome</div>
          <q-input filled v-model="novo_nome" label="Nome" />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Alterar" color="primary" @click="handleEditar()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showuserDialogDeletar">
      <q-card>
        <q-card-section class="text-center">
          <div class="text-h6">Deseja deletar?</div>
        </q-card-section>
        <q-card-actions align="center">
          <div class="row q-col-gutter-x-sm">
            <div class="col">
              <q-btn label="Não" color="red-7" v-close-popup />
            </div>
            <div class="col">
              <q-btn label="Sim" color="green-7" @click="handleDeletar()" />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import firestoreService from "src/services/FireStoreService";
import { useRouter } from "vue-router";

const {
  buscarColecao,
  deletarDocumentoPorID,
  editarNomeDoDocumento,
  buscaGenericaPorIDRealTime,
} = firestoreService();
const router = useRouter();
const showuserDialogEditar = ref(false);
const showuserDialogDeletar = ref(false);
const buscarUsuariov = ref(false);
const usuario_cpf = ref("");
const cpf = ref("");
const novo_nome = ref("");
const resposta = ref("");
const linhas = ref([]);

const colunas = [
  { name: "cpf", label: "CPF", field: "cpf", align: "left" },
  { name: "nome", label: "Nome", field: "nome", align: "left" },
  {
    name: "perguntas_respostas",
    label: "Respostas Corretas",
    field: "perguntas_respostas",
    align: "center",
  },
  { name: "actions", label: "Ações", field: "actions", align: "center" },
];

onMounted(async () => {
  await metodoBuscarUsuariosTotal();
});

const metodoBuscarUsuariosTotal = async () => {
  const result = await buscarColecao("Quiz");
  if (!result) {
    linhas.value = [];
    return;
  }
  mapeamentoTabela(result);
};
const mapeamentoTabela = (result) => {
  linhas.value = [];
  if (result.length >= 1) {
    result.forEach((item) => {
      let resp_corretas = 0;
      item.perguntas_respostas.forEach((respostas) => {
        respostas.correta ? resp_corretas++ : resp_corretas;
      });
      let formList = {
        cpf: item.cpf,
        nome: item.nome,
        perguntas_respostas: resp_corretas,
      };
      linhas.value.push(formList);
    });
  } else {
    let resp_corretas = 0;
    result.perguntas_respostas.forEach((respostas) => {
      respostas.correta ? resp_corretas++ : resp_corretas;
    });
    let formList = {
      cpf: result.cpf,
      nome: result.nome,
      perguntas_respostas: resp_corretas,
    };
    linhas.value.push(formList);
  }
};

const metodoBuscarUsuario = async () => {
  const result = await buscaGenericaPorIDRealTime("Quiz", cpf.value);
  if (result) {
    mapeamentoTabela(result);
  }
};

const moveTo = (mover) => {
  router.push(`/`);
};

const metodoPerguntaSeDeleta = (cpf) => {
  usuario_cpf.value = cpf;
  showuserDialogDeletar.value = true;
};
const handleDeletar = async (usuario) => {
  const result = await deletarDocumentoPorID("Quiz", usuario_cpf.value);
  if (result) {
    showuserDialogDeletar.value = false;
    await metodoBuscarUsuariosTotal();
  }
};

const metodoPerguntaSeEdita = (cpf) => {
  usuario_cpf.value = cpf;
  showuserDialogEditar.value = true;
};

const handleEditar = async () => {
  const sucesso = await editarNomeDoDocumento(
    "Quiz",
    usuario_cpf.value,
    novo_nome.value
  );
  if (sucesso) {
    showuserDialogEditar.value = false;
    await metodoBuscarUsuariosTotal();
  }
};
</script>

<style scoped>
.q-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 16px;
}
</style>
