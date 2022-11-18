<template>
  <div>
    <Filter v-if="Sets"/>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <table class="table table-striped table-bordered table-sm" id="data" v-if="User">
            <thead>
              <tr>
                <th>Дата</th>
                <th>ФИО</th>
                <th>Дилерский центр</th>
                <th>Направление</th>
                <th>Подразделение</th>
                <th>Источник</th>
                <th>Дата отзыва</th>
                <th>Скриншот</th>
                <th>Статус</th>
                <th>Маркетолог</th>
                <th>Комментарий</th>
                <th>Дата ответа</th>
                <th v-if="User.IS_ADMIN"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, indx) in Items"
                :key="indx"
                :class="{'table-info': item.success}">
                  <td>{{ item.date }}</td>
                  <td>{{ item.user }}</td>
                  <td>{{ item.dealership }}</td>
                  <td v-if="Number(item.passenger)">Пассажирские</td>
                  <td v-if="Number(item.commercial)">Коммерческие</td>
                  <td v-if="Number(item.sale)">Продажа</td>
                  <td v-if="Number(item.buyout)">Выкуп</td>
                  <td>{{ item.source }}</td>
                  <td>{{ item.date_feedback }}</td>
                  <td><a :href="item.screenshot" target="_blank">Скриншот</a></td>
                  <td>
                    <input type="text" class="form-control form-control-sm" v-model="item.status" v-if="User.IS_ADMIN">
                    <div v-else>{{ item.status }}</div>
                  </td>
                  <td>{{ item.checker_name }}</td>
                  <td>
                    <input type="text" class="form-control form-control-sm" v-model="item.checker_comment" v-if="User.IS_ADMIN">
                    <div v-else>{{ item.checker_comment }}</div>
                  </td>
                  <td>
                    <input type="date" class="form-control form-control-sm" v-model="item.date_response" v-if="User.IS_ADMIN">
                    <div v-else>{{ item.date_response }}</div>
                  </td>

                  <td class="text-end" v-if="User.IS_ADMIN"><button type="button" class="btn btn-primary btn-sm me-2" @click.prevent="setItem(indx)">Сохранить</button></td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Filter from '@/components/Filter.vue'

export default {
  name: 'App',
  components: {
    Filter
  },
  data() {
    return {
      Filter: {
        dealership: null,
        date_from: null,
        date_to: null
      },
      Sets: null,
      User: null,
      Items: null,
      DataTable: null,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
      }
    }
  },
  mounted: function () {
    
    this.axios.get('https://apps.yug-avto.ru/API/get/expertbot/data/?token=34b5ac8b71018c0bc7e5c050ed90b243').then((response) => {
      this.Sets = response.data
    }).then(()=>{
      let user_id = document.getElementById('VueExpertBotApp').getAttribute('user') || 1880
      this.axios.get('https://portal.yug-avto.ru/service/expertbot/api/?entity=user&id='+user_id).then((response) => {
        this.User = response.data
      }).then( () => {
        let url = 'https://apps.yug-avto.ru/API/get/expertbot/items/?token=34b5ac8b71018c0bc7e5c050ed90b243'
        if ( !this.User.IS_ADMIN ) url += '&user='+this.User.ID
        this.axios.get(url).then((response) => {
          this.Items = response.data
        }).then( () => {
          this.initTable()
        })
      })
    })

  },
  methods: {
    getTable() {
      this.Items = null
      this.DataTable.destroy()
      let url = 'https://apps.yug-avto.ru/API/get/expertbot/items/?token=34b5ac8b71018c0bc7e5c050ed90b243'
      if ( !this.User.IS_ADMIN ) url += '&user='+this.User.ID
      if (this.Filter.dealership) url += '&dealership='+this.Filter.dealership
      if (this.Filter.date_from) url += '&date_from='+this.Filter.date_from
      if (this.Filter.date_to) url += '&date_to='+this.Filter.date_to

      this.axios.get(url).then((response) => {
        this.Items = response.data
      }).then( () => {
        this.initTable()
      })
    },

    clearFilter() {
      this.DataTable.destroy()
      let url = 'https://apps.yug-avto.ru/API/get/expertbot/items/?token=34b5ac8b71018c0bc7e5c050ed90b243'
      if ( !this.User.IS_ADMIN ) url += '&user='+this.User.ID

      this.axios.get(url).then((response) => {
        this.Items = response.data
      }).then( () => {
        this.initTable()
      })
    },
    

    initTable() {
      this.DataTable = window.jQuery('#data').DataTable({
          "order": [
              [ 0, "desc" ]
          ],
          "language": {
              "lengthMenu": "_MENU_ записей на странице",
              "zeroRecords": "Записей не найдено",
              "info": "Показано _PAGE_ из _PAGES_",
              "infoEmpty": "Записей не найдено",
              "infoFiltered": "(из _MAX_ записей)"
          },
          'pageLength': 50
      })
    },

    setItem(indx) {
      let send = {
        id: this.Items[indx].id,
        status: this.Items[indx].status,
        checker_name: this.User.UF_FULL_NAME,
        checker_comment: this.Items[indx].checker_comment,
        date_response: this.Items[indx].date_response,
      }
      this.axios.post(
        'https://apps.yug-avto.ru/API/set/expertbot/item/?token=34b5ac8b71018c0bc7e5c050ed90b243',
        JSON.stringify(send),
        {headers: this.headers}
      ).then( () => {
        this.Items[indx].success = true
        this.Items[indx].checker_name = this.User.UF_FULL_NAME
        setTimeout(() => {
          this.Items[indx].success = false
        }, 2000);
      })
    }
  }
}
</script>

<style scoped>
@import './assets/css/bootstrap.min.css';

.bg-yalightgray {background-color: #eee;}


.text-minus {
  font-size: .8rem;
}
</style>
