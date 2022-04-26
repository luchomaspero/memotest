
const URL = '192.168.0.14:8080'
const NUMERO_CUADROS = 12

context('memotest', () => {

    before(() => {
        cy.visit(URL)
    })
    
    it('Se asegura que haya un tablero con cuadros en esa url', () => {
        cy.get('#tablero').find('.cuadro').should('have.length', NUMERO_CUADROS)
    })

    it('Se asegura que los cuadros sean aleatorios', () => {
        cy.get('.cuadro').then((cuadros) => {
            let clasesOriginales = []
            cuadros.each(function(i,cuadro) {
                clasesOriginales.push(cuadro.className)
            })
        
            cy.visit(URL)
        
            let clasesNuevas = []
            cy.get('.cuadro').then(nuevosCuadros => {
                nuevosCuadros.each(function(i,cuadro){
                    clasesNuevas.push(cuadro.className)
                })
                cy.wrap(clasesOriginales).should('not.deep.equal',clasesNuevas)
                })    
            })
    })

    describe('Resuelve el juego', () =>{
        let mapaDePares, listaDePares
        it('Elige una combinación errónea', () => {
            cy.get('.cuadro').then(cuadros => {
                mapaDePares = obtenerParesDeCuadros(cuadros)
                listaDePares = Object.values(mapaDePares)

                console.log(listaDePares)
                cy.get(listaDePares[0][0]).click()
                cy.get(listaDePares[1][0]).click()

                cy.get('.cuadro').should('have.length',NUMERO_CUADROS)
            })
        })
        
        it('resuelve el juego', () => {
            cy.get('.cuadro').should('have.length', NUMERO_CUADROS)

            listaDePares.forEach((par) => {
                cy.get(par[0]).click()
                cy.get(par[1]).click()
            })

            cy.get('.cuadro').should('have.length', 0)

            cy.get('#tablero').should('not.be.visible')
            
            const numeroTurnos = NUMERO_CUADROS / 2 + 1 //testeé 1 incorrecto y después hice todo perfecto
            cy.get('#fin-del-juego').should('be.visible').contains(
                `Fin del Juego! Tardaste ${numeroTurnos} turnos en terminar`, 
            )
        })
    })
})


function obtenerParesDeCuadros(cuadros){
    const pares = {}

    cuadros.each((i, cuadro) => {
        const claseColor = cuadro.className.replace('cuadro h-100', '')

        if (pares[claseColor]){
            pares[claseColor].push(cuadro)
        }else{
            pares[claseColor] = [cuadro]
        }
    })
    return pares

} 