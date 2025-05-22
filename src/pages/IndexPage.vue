<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="q-pa-md" style="max-width: 600px; width: 100%">

      <!-- Diálogo para nome e CPF -->
      <q-dialog v-model="showUserDialog" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Informe seus dados</div>
            <q-input filled v-model="usuario.nome" label="Nome" />
            <q-input filled v-model="usuario.cpf" label="CPF" mask="###.###.###-##" class="q-mt-sm" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Iniciar Quiz" color="primary" :disable="!usuario.nome || !usuario.cpf" @click="showUserDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Card do quiz -->
      <q-card v-if="!showUserDialog">
        <q-card-section>
          <div class="text-h5">Pergunta {{ currentQuestionIndex + 1 }} de {{ questions.length }}</div>
          <div class="q-mt-md">{{ currentQuestion.question }}</div>
        </q-card-section>

        <q-card-section>
          <q-list bordered>
            <q-item
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              clickable
              v-ripple
              @click="selectOption(index)"
              :class="{ 'bg-green-2': answered && index === currentQuestion.correctIndex, 'bg-red-2': answered && index === selectedOption && index !== currentQuestion.correctIndex }"
            >
              <q-item-section>{{ option }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Próxima"
            color="primary"
            :disable="!answered"
            @click="nextQuestion"
          />
        </q-card-actions>
      </q-card>

      <!-- Resultado -->
      <q-dialog v-model="showResult">
        <q-card>
          <q-card-section>
            <div class="text-h6">Resultado</div>
            <p>Nome: {{ usuario.nome }}</p>
            <p>CPF: {{ usuario.cpf }}</p>
            <p>Você acertou {{ score }} de {{ questions.length }} perguntas.</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Reiniciar" color="primary" @click="restart" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>


<script setup>
import { ref, computed } from 'vue'

const usuario = ref({
  nome: "",
  cpf: "",
  perguntas_respostas: [],
})

const showUserDialog = ref(true)

const questions = [
  {
    question: 'Qual é a capital do Brasil?',
    options: ['São Paulo', 'Brasília', 'Rio de Janeiro', 'Salvador'],
    correctIndex: 1
  },
  {
    question: 'Quem pintou a Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctIndex: 2
  },
  {
    question: 'Qual o maior planeta do sistema solar?',
    options: ['Terra', 'Marte', 'Júpiter', 'Saturno'],
    correctIndex: 2
  },
  {
    question: 'Quanto é 9 x 9?',
    options: ['81', '72', '99', '90'],
    correctIndex: 0
  },
  {
    question: 'Qual elemento tem o símbolo "O"?',
    options: ['Ouro', 'Oxigênio', 'Osmium', 'Óxido'],
    correctIndex: 1
  },
  {
    question: 'Quem escreveu "Dom Casmurro"?',
    options: ['Machado de Assis', 'José de Alencar', 'Clarice Lispector', 'Monteiro Lobato'],
    correctIndex: 0
  },
  {
    question: 'Em que ano o homem pisou na Lua?',
    options: ['1965', '1969', '1972', '1959'],
    correctIndex: 1
  },
  {
    question: 'Qual é a fórmula da água?',
    options: ['H2O', 'CO2', 'O2', 'H2SO4'],
    correctIndex: 0
  },
  {
    question: 'Quem descobriu o Brasil?',
    options: ['Cristóvão Colombo', 'Pedro Álvares Cabral', 'Dom Pedro I', 'Vasco da Gama'],
    correctIndex: 1
  },
  {
    question: 'Quantos continentes existem?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2
  }
]

const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const score = ref(0)
const showResult = ref(false)
const answered = ref(false)

const currentQuestion = computed(() => questions[currentQuestionIndex.value])

function selectOption(index) {
  if (answered.value) return
  selectedOption.value = index
  answered.value = true

  const question = currentQuestion.value
  const isCorrect = index === question.correctIndex

  if (isCorrect) {
    score.value++
  }

  // Armazenar na lista de respostas
  usuario.value.perguntas_respostas.push({
    pergunta: question.question,
    resposta_usuario: question.options[index],
    resposta_correta: question.options[question.correctIndex],
    correta: isCorrect,
  })
}

function nextQuestion() {
  if (currentQuestionIndex.value + 1 < questions.length) {
    currentQuestionIndex.value++
    selectedOption.value = null
    answered.value = false
  } else {
    showResult.value = true
    console.log(usuario.value)
  }
}

function restart() {
  currentQuestionIndex.value = 0
  selectedOption.value = null
  score.value = 0
  showResult.value = false
  answered.value = false
  usuario.value.perguntas_respostas = []
  showUserDialog.value = true
 usuario.value = {
  nome: "",
  cpf: "",
  perguntas_respostas: [],
}

}
</script>

