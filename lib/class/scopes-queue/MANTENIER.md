# Scope info

Los scopes manejan cuatro eventos principales

- creación: el scope se crea con new Scope o db.createScope(). queda abierto a recibir operations y comienza a esperar su turno.
- my-turn: cuando llega su turno, la cola de scopes (scopesQueue) manda una señal via myTurnTrigger() que gatilla que se comienzen a ejecutar las operaciones, tanto las que van llegando como las que ya estaban esperando.
- userClose: el usuario cierra el scope con scope.close(). El scope ya no recibe más operations y comienza a esperar que toda la lista de operations termine.
- end: cuando el usuario ya cerró el scope y todas las operations en cola ya han finalizado (sea con error o sin el), el scope finaliza lo cual da la orden en la scopesQueue para dar el turno a la siguiente scope.

## es decir:
- las operaciónes se reciben desde creación hasta scope.close()
- las operaciónes se ejecutan desde my-turn hasta end
- scopesQueue utiliza los eventos my-turn y end para ejecutar las scopes de forma serial.

- si el usuario o llama a scope.close() jamás se llegará a end y la cola se eststancará.