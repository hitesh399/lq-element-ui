<template>
    <div>
        <lqel-form name="test_form" :rules="rules" ref="lqForm" action="http://localhost:8080">
            <template v-slot="{model, submit}">
                {{model}}
                <lqel-input labelText="Hello" id="_text_field" type="password" :show-password="true">
                    <template v-slot:label>I am Label</template>
                </lqel-input>
                <lqel-input-number id="_number" @change="handleChangeNumber" :min="1" :max="10"></lqel-input-number>Group Radio Button
                <lqel-radio-group id="_radio">
                    <el-radio :label="3">Option A</el-radio>
                    <el-radio :label="6">Option B</el-radio>
                    <el-radio :label="9">Option C</el-radio>
                </lqel-radio-group>Single radio Button
                <lqel-radio :label="3" id="_single_radio_btn">Option A</lqel-radio>
                <lqel-radio :label="4" id="_single_radio_btn">Option A</lqel-radio>Group Checkbox
                <lqel-checkbox-group id="_checkList">
                    <el-checkbox label="Option A"></el-checkbox>
                    <el-checkbox label="Option B"></el-checkbox>
                    <el-checkbox label="Option C"></el-checkbox>
                    <el-checkbox label="disabled"></el-checkbox>
                    <el-checkbox label="selected and disabled"></el-checkbox>
                </lqel-checkbox-group>Single Checkbox
                <lqel-checkbox id="_single_checkbox" :true-label="1" :false-label="0" label="Option1" />Switch
                <lqel-switch
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="Pay by month"
                    inactive-text="Pay by year"
                    id="_switch"
                ></lqel-switch>
                <lqel-time-select
                    id="_time"
                    :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
            }"
                    placeholder="Select time"
                ></lqel-time-select>Time Range
                <lqel-time-select
                    placeholder="Start time"
                    id="startTime"
                    :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            maxTime: model.endTime
            }"
                ></lqel-time-select>
                <lqel-time-select
                    placeholder="End time"
                    id="endTime"
                    :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            minTime: model.startTime
            }"
                ></lqel-time-select>

                <lqel-date-picker id="_date_picker" type="date" placeholder="Pick a day"></lqel-date-picker>
                <lqel-date-picker
                    id="_datetime_picker"
                    type="datetime"
                    placeholder="Select date and time"
                ></lqel-date-picker>

                <!-- <lqel-select
                    id="_select"
                    :remote="true"
                    action="https://api.github.com/users"
                    response-key="data"
                    :filterable="true"
                    multiple
                    :static-data="{since: 135}"
                    clearable
                    is-output-object
                    item-text="login"
                /> -->
                <lqel-select
                    id="_select2"
                    labelText="Create New Item"
                    :filterable="true"
                    multiple
                    :multiple-limit="2"
                    clearable
                    group-by="category_name"
                    :options="[{id: 1, name: 'Select 1', category_name: 'Test1'}, {id: 2, name: 'Select 2', category_name: 'Test1'}, {id: 3, name: 'Select 3', category_name: 'Test2'}, {id: 4, name: 'Select 4', disabled: true}]"
                    allow-create
                    is-output-object
                    item-text="name"
                >
                <template v-slot:item="{item, disabled}">
                    <el-option :value="item.name" :disabled="disabled" />
                </template>
            </lqel-select>
                <lqel-transfer filter-placeholder="State Abbreviations" id="_transfer" :data="data" />
                <lqel-slider id="_slider" :step="10" show-stops />
                <lqel-slider id="_slider2" show-input />
                <div class="block">
                    <span class="demonstration">Color for different levels</span>
                    <lqel-rate id="_rate" :colors="colors"></lqel-rate>
                </div>
                <div class="block">
                    <span class="demonstration">With default value</span>
                    <lqel-color-picker id="color1"></lqel-color-picker>
                </div>
                <el-button type="submit" @click="(e) => {e.preventDefault(); submit()}">Submit</el-button>
            </template>
        </lqel-form>
        <lqel-table action="https://jsonplaceholder.typicode.com/posts" 
            tableName="_test_table"
            dataKey="data" 
            :default-sort = "{prop: 'id', order: 'descending'}"
            >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
                prop="title"
                label="Title"
                sortable="custom"
                width="180">
              </el-table-column>
              <el-table-column
                prop="id"
                sortable="custom"
                label="id"
                width="180">
              </el-table-column>
               <el-table-column
                prop="body"
                label="Body"
                width="180">
              </el-table-column>
        </lqel-table>
    </div>
</template>
<script>
export default {
    data() {
        const generateData = _ => {
            const data = [];
            const states = [
                'California',
                'Illinois',
                'Maryland',
                'Texas',
                'Florida',
                'Colorado',
                'Connecticut '
            ];
            const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT'];
            states.forEach((city, index) => {
                data.push({
                    label: city,
                    key: `_${index}`,
                    initial: initials[index]
                });
            });
            return data;
        };

        return {
            radio: 1,
            data: generateData(),
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
            rules: {
                _text_field: {
                    presence: { allowEmpty: false }
                },
                _rate: { presence: { allowEmpty: false } }
            }
        };
    },
    methods: {
        handleChangeNumber(value) {
            console.log('handleChangeNumber', value);
        }
    }
};
</script>