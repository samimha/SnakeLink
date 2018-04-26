
package org.example.websocket;



import java.io.IOException;
import static java.lang.System.console;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.inject.Inject;

@ApplicationScoped
@ServerEndpoint("/actions")
public class WebSocketServer {
    @Inject
    private SessionHandler sessionHandler;
    
     @OnOpen
        public void open(Session session) {
            System.out.println("-----------------!!!!!!!!!!!!!_----------------------");
            
            sessionHandler.addSession(session);
    }

    @OnClose
        public void close(Session session) {
            sessionHandler.removeSession(session);
    }

    @OnError
        public void onError(Throwable error) {
            Logger.getLogger(WebSocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
        public void handleMessage(String message, Session session) {
            try {
            session.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
            System.out.println("moro");
    }
}
