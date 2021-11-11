<template>
    <div>
        <h1>Все записи</h1>
        <button class="btn showForm" v-on:click="visibleAddForm=!visibleAddForm">{{visibleAddForm? 'Скрыть форму': 'Показать форму'}}</button>
        <div v-show="visibleAddForm" class="row addForm">
            <form class="mb=3" @submit.prevent="addPost">
                <h3>Добавить(редактировать) пост</h3>
                <div class="mb-3">
                    <label for="tilte" class="form-label">Заголовок</label>
                    <input v-model="post.title" class="form-control" id="tilte" type="text">
                </div>
                <div class="mb-3">
                    <label for="description">Описание</label>
                    <textarea v-model="post.description" class="form-control" id="description" rows="4"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Добавить пост</button>
            </form>
        </div>

        <div v-if="loading">Загрузка</div>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Название поста</th>
                <th scope="col">Описание</th>
                <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="post in posts" :key="post.id">
                <th>{{ post.id }}</th>
                <td>{{ post.title }}</td>
                <td>{{ post.description }}</td>
                <td>
                    <button
                        @click="editPost(post)"
                        class="btn btn-success">
                        Редактировать
                    </button>

                    <button
                        @click="deletePost(post.id)"
                        class="btn btn-danger">
                        Удалить
                    </button>
                </td>
            </tr>

            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    <a :class="{disabled: !pagination.prev_page_url}"
                       @click.prevent ="getPosts(pagination.prev_page_url)"
                        class="page-link" href="#">Назад</a>
                </li>
                <li class="page-item disabled">
                    <a class="page-link" href="#">Страница {{pagination.current_page}} из {{pagination.last_page}}</a>
                </li>
                <li class="page-item">
                    <a :class="{disabled: !pagination.next_page_url}"
                       @click.prevent ="getPosts(pagination.next_page_url)"
                       class="page-link" href="#">Вперед</a>
                </li>
            </ul>
        </nav>
    </div>

</template>

<script>
export default {
    data() {
        return {
            posts: [],
            post: {
                id: '',
                title: '',
                description: ''
            },
            post_id: '',
            pagination: {},
            edit: false,
            loading: true,
            errored: false,
            visibleAddForm: false,
        }
    },
    mounted() {
        this.getPosts()
    },
    methods: {
        getPosts(pageUrl) {
            pageUrl = pageUrl || '/api/posts'
            axios
                .get(pageUrl)
                .then(response => {
                    this.posts = response.data.data
                    this.makePagination(response.data)
                })
                .catch(error => {
                    this.errored = true
                })
                .finally(() => this.loading = false)
                this.post = {
                        id: '',
                        title: '',
                        description: ''
                }
        },
        makePagination(response) {
            let pagination = {
                current_page: response.current_page,
                last_page: response.last_page,
                prev_page_url: response.prev_page_url,
                next_page_url: response.next_page_url
            }
            this.pagination = pagination
        },
        deletePost(id) {
            axios
            .delete(`api/posts/${id}`)
            .then(response => this.getPosts())
            .catch(error => console.log(error))
        },
        addPost() {
            if (this.edit === false) {
                axios
                    .post('/api/posts', {
                        title: this.post.title,
                        description: this.post.description
                    })
                    .then(response => {
                        this.post.title = ''
                        this.post.description = ''
                        this.getPosts()
                        console.log(response)
                    })
                    .catch(
                        error => console.log(error)
                    )
            } else {

                axios
                    .put(`/api/posts/${this.post.id}`, {
                        title: this.post.title,
                        description: this.post.description
                    })
                    .then(response => {
                        this.post.title = ''
                        this.post.description = ''
                        this.getPosts()

                    })
                    .catch(
                        error => console.log(error)
                    )
            }
        },
        editPost(post) {
            this.visibleAddForm = true
            this.edit = true
            this.post.id = post.id
            this.post.title = post.title
            this.post.description = post.description
        }
    }
}
</script>
