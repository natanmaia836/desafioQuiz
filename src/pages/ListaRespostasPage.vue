<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Cadastro de Respostas</div>

            <q-btn icon="home" color="green"  @click="moveTo()" ><q-tooltip>Voltar</q-tooltip></q-btn>

      </q-card-section>

      <q-card-section>

        <q-input
            class="q-mr-sm col-md-2 col-xs-10"
            bg-color="white"
            rounded
            outlined
            dense
            v-model.trim="cpf"
            @keyup.enter="metodoBuscarUsuario()"
          >
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


      </q-card-section>

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
            <q-btn round outline dense color="negative" icon="delete" @click="metodoDeletar(props.row)" ><q-tooltip>Deletar</q-tooltip></q-btn>
            <q-btn class="q-ml-sm" round outline dense color="orange" icon="edit_note" @click="metodoEditar(props.row)" ><q-tooltip>Editar</q-tooltip></q-btn>
          </q-td>
        </template>
      </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showuserDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Altere o nome</div>
            <q-input filled v-model="novo_nome" label="Nome" />

          </q-card-section>
          <q-card-actions align="center">
            <q-btn label="Alterar" color="primary"   />


          </q-card-actions>

        </q-card>
      </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import firestoreService from "src/services/FireStoreService";
import { useRouter } from "vue-router";

const {buscarColecao, deletarDocumentoPorID, editarNomeDoDocumento, buscaGenericaPorIDRealTime} = firestoreService();
const router = useRouter();
const showuserDialog = ref(false)
const buscarUsuariov = ref(false)
const usuario = null
const cpf = ref('')
const novo_nome = ref('')
const resposta = ref('')
const linhas = ref([])

const colunas = [
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'resposta', label: 'Resposta', field: 'resposta', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

onMounted( async() => {
await  metodoBuscarUsuariosTotal()
})

const metodoBuscarUsuariosTotal = async () => {
  linhas.value = []
  linhas.value = await buscarColecao("Quiz")
}

const metodoBuscarUsuario = async () => {
linhas.value = []
const result = await buscaGenericaPorIDRealTime("Quiz",cpf.value)

linhas.value = result
}

const moveTo = (mover) => {
  router.push(`/`);
};

const metodoDeletar = async(usuario) => {
const result = await deletarDocumentoPorID("Quiz",usuario.cpf);

  await metodoBuscarUsuariosTotal()
}


const metodoEditar = (usuario) => {
  usuario.value = usuario
  showuserDialog.value = true
}

const editarNome = async () => {
  const result = await editarNomeDoDocumento("Quiz",usuario.value.cpf, {nome: novo_nome.value})
  await metodoBuscarUsuariosTotal()
  showuserDialog.value = false
}
</script>

<style scoped>
.q-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 16px;
}
</style>
