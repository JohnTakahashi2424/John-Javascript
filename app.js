import { createApp, ref, computed, onMounted } from 'https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.esm-browser.js';
import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.mjs';

const db = new Dexie('db_usss017224_jonathan_guandique');

db.version(1).stores({
    autor: '++idAutor, codigo, nombre, pais, telefono',
    libros: '++idLibro, idAutor, isbn, titulo, editorial, edicion'
});

const App = {
    setup() {
        const sidebarVisible = ref(false);
        const windowWidth = ref(window.innerWidth);
        const darkMode = ref(localStorage.getItem('theme') === 'dark');
        
        const applyTheme = () => {
            document.documentElement.setAttribute('data-bs-theme', darkMode.value ? 'dark' : 'light');
            localStorage.setItem('theme', darkMode.value ? 'dark' : 'light');
        };
        applyTheme();

        const toggleDarkMode = () => {
            darkMode.value = !darkMode.value;
            applyTheme();
        };
        
        window.addEventListener('resize', () => {
            windowWidth.value = window.innerWidth;
        });

        const currentTab = ref('autores');

        const autores = ref([]);
        const filtroAutor = ref('');
        const editModeAutor = ref(false);
        const formAutor = ref({ idAutor: null, codigo: '', nombre: '', pais: '', telefono: '' });
        const isSaving = ref(false);

        const cargarAutores = async () => {
            autores.value = await db.autor.toArray();
        };

        // Configuración global de Alertify
        alertify.set('notifier', 'position', 'bottom-right');
        alertify.defaults.theme.ok = 'btn btn-primary';
        alertify.defaults.theme.cancel = 'btn btn-danger';
        alertify.defaults.theme.input = 'form-control';

        const guardarAutor = async () => {
            isSaving.value = true;
            try {
                const { idAutor, ...data } = formAutor.value;
                if (editModeAutor.value) {
                    await db.autor.update(idAutor, data);
                    alertify.success('Autor actualizado con éxito');
                } else {
                    await db.autor.add(data);
                    alertify.success('Autor guardado con éxito');
                }
                await cargarAutores();
                cancelarEdicionAutor();
            } catch (error) {
                alertify.error('Error al guardar el autor');
            } finally {
                // Simulación de animación breve
                setTimeout(() => {
                    isSaving.value = false;
                }, 500);
            }
        };

        const editarAutor = (autor) => {
            formAutor.value = { ...autor };
            editModeAutor.value = true;
        };

        const eliminarAutor = async (id) => {
            alertify.confirm('Confirmar eliminación', '¿Estás seguro de eliminar este autor?', 
                async () => {
                    await db.autor.delete(id);
                    await cargarAutores();
                    alertify.success('Autor eliminado correctamente');
                }, 
                () => {
                    alertify.error('Operación cancelada');
                }
            ).set('labels', {ok:'Si, eliminar', cancel:'Cancelar'});
        };

        const cancelarEdicionAutor = () => {
            formAutor.value = { idAutor: null, codigo: '', nombre: '', pais: '', telefono: '' };
            editModeAutor.value = false;
        };

        const autoresFiltrados = computed(() => {
            const qr = filtroAutor.value.toLowerCase().trim();
            if (!qr) return autores.value;
            return autores.value.filter(a => 
                a.nombre.toLowerCase().includes(qr) ||
                a.codigo.toLowerCase().includes(qr) ||
                a.pais.toLowerCase().includes(qr)
            );
        });

        const libros = ref([]);
        const filtroLibro = ref('');
        const editModeLibro = ref(false);
        const formLibro = ref({ idLibro: null, idAutor: '', isbn: '', titulo: '', editorial: '', edicion: '' });

        const cargarLibros = async () => {
            libros.value = await db.libros.toArray();
        };

        const guardarLibro = async () => {
            isSaving.value = true;
            try {
                const data = {
                    idAutor: parseInt(formLibro.value.idAutor, 10),
                    isbn: formLibro.value.isbn,
                    titulo: formLibro.value.titulo,
                    editorial: formLibro.value.editorial,
                    edicion: formLibro.value.edicion
                };

                if (editModeLibro.value) {
                    await db.libros.update(formLibro.value.idLibro, data);
                    alertify.success('Libro actualizado correctamente');
                } else {
                    await db.libros.add(data);
                    alertify.success('Libro guardado correctamente');
                }
                await cargarLibros();
                cancelarEdicionLibro();
            } catch (error) {
                alertify.error('Error al guardar el libro');
            } finally {
                setTimeout(() => {
                    isSaving.value = false;
                }, 500);
            }
        };

        const editarLibro = (libro) => {
            formLibro.value = { ...libro };
            editModeLibro.value = true;
        };

        const eliminarLibro = async (id) => {
            alertify.confirm('Confirmar eliminación', '¿Estás seguro de eliminar este libro?',
                async () => {
                    await db.libros.delete(id);
                    await cargarLibros();
                    alertify.success('Libro eliminado correctamente');
                },
                () => {
                    alertify.error('Operación cancelada');
                }
            ).set('labels', {ok:'Si, eliminar', cancel:'Cancelar'});
        };

        const cancelarEdicionLibro = () => {
            formLibro.value = { idLibro: null, idAutor: '', isbn: '', titulo: '', editorial: '', edicion: '' };
            editModeLibro.value = false;
        };

        const librosFiltrados = computed(() => {
            const qr = filtroLibro.value.toLowerCase().trim();
            if (!qr) return libros.value;
            return libros.value.filter(l => 
                l.titulo.toLowerCase().includes(qr) ||
                l.isbn.toLowerCase().includes(qr) ||
                l.editorial.toLowerCase().includes(qr)
            );
        });

        const obtenerNombreAutor = (idAutor) => {
            const autor = autores.value.find(a => a.idAutor === idAutor);
            return autor ? autor.nombre : 'Desconocido/Eliminado';
        };

        onMounted(async () => {
            await cargarAutores();
            await cargarLibros();
        });

        return {
            sidebarVisible,
            windowWidth,
            darkMode,
            toggleDarkMode,
            currentTab,
            autores,
            filtroAutor,
            editModeAutor,
            formAutor,
            guardarAutor,
            editarAutor,
            eliminarAutor,
            cancelarEdicionAutor,
            autoresFiltrados,
            libros,
            filtroLibro,
            editModeLibro,
            formLibro,
            guardarLibro,
            editarLibro,
            eliminarLibro,
            cancelarEdicionLibro,
            librosFiltrados,
            obtenerNombreAutor,
            isSaving
        };
    }
};

const app = createApp(App);
app.mount('#app');
