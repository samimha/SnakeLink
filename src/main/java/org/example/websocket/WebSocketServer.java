
package org.example.websocket;



import java.io.IOException;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;

@ApplicationScoped
@ServerEndpoint("/actions")
public class WebSocketServer {
    
    private SessionHandler sessionHandler = new SessionHandler();
    
     @OnOpen
        public void open(Session session) {
            System.out.println("---------------------------------------Opening Session:" + session.getId());
            
            sessionHandler.addSession(session);
    }

    @OnClose
        public void close(Session session) {
            sessionHandler.removeSession(session);
            System.out.println("---------------------------------------Closing Session"+ session.getId());
    }

    @OnError
        public void onError(Throwable error) {
            Logger.getLogger(WebSocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
        public void handleMessage(String message, Session session) {
            System.out.println("--------------------------------------Message from: "+session.getId());
            try {
            session.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
            System.out.println("moro");
    }
}
