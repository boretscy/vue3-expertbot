<template>
    <div class="container-fluid text-minus">
      <div class="row">
        <div class="col-md-2">
          <div class="form-group">
            <label class="form-label mt-4">Дилерский центр</label>
            <select class="form-select form-select-sm" v-model="$parent.Filter.dealership">
              <option value="0"></option>
              <option
                  v-for="i in $parent.Sets.dealerships"
                  :key="i.id"
                  :value="i.id">{{i.name}}</option>
            </select>
          </div>
        </div>
        <div class="col-md-1">
          <div class="form-group">
            <label class="form-label mt-4">С</label>
            <input type="date" class="form-control form-control-sm" v-model="$parent.Filter.date_from">
          </div>
        </div>
        <div class="col-md-1">
          <div class="form-group">
            <label class="form-label mt-4">По</label>
            <input type="date" class="form-control form-control-sm" v-model="$parent.Filter.date_to">
          </div>
        </div>
        <div class="col-md-2">
          <div class="form-group">
            <label class="form-label mt-4">Источник</label>
            <select class="form-select form-select-sm" v-model="$parent.Filter.source">
              <option value="0"></option>
              <option
                  v-for="i in $parent.Sets.sources"
                  :key="i.id"
                  :value="i.id">{{i.name}}</option>
            </select>
          </div>
        </div>
        <div class="col-md-2">
          <div class="form-group">
            <label class="form-label mt-4">Статус</label>
            <select class="form-select form-select-sm" v-model="$parent.Filter.status">
              <option value="0"></option>
              <option
                  v-for="i in $parent.Sets.statuses"
                  :key="i.id"
                  :value="i.id">{{i.name}}</option>
            </select>
          </div>
        </div>
        <div class="col-md-2 pt-5">
          <fieldset class="pt-1">
            <button type="button" class="btn btn-primary btn-sm me-2" @click.prevent="$parent.getTable">Применить</button>
            <button type="button" class="btn btn-secondary btn-sm" @click.prevent="$parent.clearFilter">Сбросить</button>
          </fieldset>
        </div>
        <div class="col-md text-end pt-5">
          Бот: <a href="https://t.me/YugAvtoExpertFeedbacksBot" target="_blank">https://t.me/YugAvtoExpertFeedbacksBot</a>
        </div>
      </div>
      <div class="row py-3"><div class="col"><hr /></div></div>
    </div>
</template>

<script>
export default {
    name: 'Filter'
}
</script>