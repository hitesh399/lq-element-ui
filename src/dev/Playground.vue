<template>
    <div>
       <!--  <lq-el-form name="test_form" :rules="rules" ref="lqForm" action="http://localhost:8080">
            <template v-slot="{model, submit}">
                {{model}}
                <lq-el-phone id="phone_no" placeholder="Test I am here a placeholder" size="sm" />
                <lq-el-phone-or-text id="phone_no_email" placeholder="Email/Mobile No."/>
                <lq-el-place id="place" :value="test_value" />
                <lq-el-file id="_file" :thumb="{width:600, height: 600}" />
                <el-input placeholder="Please input" ></el-input>

               <lq-el-input
                    placeholder="Test I am here a placeholder"
                    id="_text_field"
                    label-text="Test"
                    type="text"
                >
                  <template v-slot:label>I am Label</template>
                </lq-el-input> -->
                <!--    <lq-el-input-number id="_number" @change="handleChangeNumber" :min="1" :max="10"></lq-el-input-number>Group Radio Button
                <lq-el-radio-group id="_radio">
                    <el-radio :label="3">Option A</el-radio>
                    <el-radio :label="6">Option B</el-radio>
                    <el-radio :label="9">Option C</el-radio>
                </lq-el-radio-group>Single radio Button
                <lq-el-radio :label="3" id="_single_radio_btn">Option A</lq-el-radio>
                <lq-el-radio :label="4" id="_single_radio_btn">Option A</lq-el-radio>Group Checkbox
                <lq-el-checkbox-group id="_checkList">
                    <el-checkbox label="Option A"></el-checkbox>
                    <el-checkbox label="Option B"></el-checkbox>
                    <el-checkbox label="Option C"></el-checkbox>
                    <el-checkbox label="disabled"></el-checkbox>
                    <el-checkbox label="selected and disabled"></el-checkbox>
                </lq-el-checkbox-group>Single Checkbox
                <lq-el-checkbox
                    id="_single_checkbox"
                    :true-label="1"
                    :false-label="0"
                    label="Option1"
                />Switch
                <lq-el-switch
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="Pay by month"
                    inactive-text="Pay by year"
                    id="_switch"
                ></lq-el-switch>
                <lq-el-time-select
                    id="_time"
                    :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
            }"
                    placeholder="Select time"
                ></lq-el-time-select>Time Range
                <lq-el-time-select
                    placeholder="Start time"
                    id="startTime"
                    :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            maxTime: model.endTime
            }"
                ></lq-el-time-select>
                <lq-el-time-select
                    placeholder="End time"
                    id="endTime"
                    :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            minTime: model.startTime
            }"
                ></lq-el-time-select>

                <lq-el-date-picker id="_date_picker" type="date" placeholder="Pick a day"></lq-el-date-picker>
                <lq-el-date-picker
                    id="_datetime_picker"
                    type="datetime"
                    placeholder="Select date and time"
                ></lq-el-date-picker>

                <lq-el-select
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
                />
                <lq-el-select
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
                </lq-el-select>
                <lq-el-transfer
                    filter-placeholder="State Abbreviations"
                    id="_transfer"
                    :data="data"
                />
                <lq-el-slider id="_slider" :step="10" show-stops />
                <lq-el-slider id="_slider2" show-input />
                <div class="block">
                    <span class="demonstration">Color for different levels</span>
                    <lq-el-rate id="_rate" :colors="colors"></lq-el-rate>
                </div>
                <div class="block">
                    <span class="demonstration">With default value</span>
                    <lq-el-color-picker id="color1"></lq-el-color-picker>
                </div>-->
                <!-- <el-button type="submit" @click="(e) => {e.preventDefault(); submit()}">Submit</el-button> -->
      <!--       </template>
        </lq-el-form> -->
         <lq-list-filter name="_test_table">
            <template v-slot:default="props">qwdqw {{props.model.selected}}</template>
        </lq-list-filter>
        <lq-el-table
            :defaultPageSize="20"
            :sortByKeyTransform="{first_name: 'last_game'}"
            action="https://gorest.co.in/public-api/users"
            tableName="_test_table"
            data-key="data.result"
            total-key="data._meta.totalCount"
            page-size-key="data._meta.perPage"
            :transformKeys="['data._meta.perPage:page_size']"
            :static-data="{_format: 'json', 'access-token': 'Z-m4SzDK_vtWbJHkxjK2V3z0AwiSWRBe6-r-'}"
            :default-sort="{prop: 'id', order: 'descending'}"
        >
            <lq-el-table-index />
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" sortable="custom" label="id" width="180"></el-table-column>
            <el-table-column prop="first_name" label="First Name" sortable="custom" width="180"></el-table-column>
            <el-table-column prop="last_name" label="Last Name" width="180"></el-table-column>
        </lq-el-table>
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
            test_value: {
                formatted_address:
                    'Agra - Lucknow Expy, Khargua, Deeg, Uttar Pradesh, India',
                geometry: {
                    location: { lat: 26.9097795, lng: 79.2322001 },
                    viewport: {
                        south: 26.9084305197085,
                        west: 79.23085111970852,
                        north: 26.9111284802915,
                        east: 79.23354908029148
                    }
                },
                place_id:
                    'EjhBZ3JhIC0gTHVja25vdyBFeHB5LCBLaGFyZ3VhLCBEZWVnLCBVdHRhciBQcmFkZXNoLCBJbmRpYSIuKiwKFAoSCYU2Qmd7a3Q5EfLivNhidG9FEhQKEglZDb8j5fp1OREYbxU6obqUwg',
                id: 'test_form.place'
            },
            rules: {
                _text_field: {
                    presence: { allowEmpty: false }
                },
                _file: {
                    presence: { allowEmpty: false },
                    file: {
                        message: {
                            acceptedFiles: '^Please select only image.',
                            maxFileSize: '^Image size should be less than 5 MB.'
                        },
                        acceptedFiles: 'image/*',
                        // maxFileSize: 5,
                        minImageDimensions: [600, 600]
                    }
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