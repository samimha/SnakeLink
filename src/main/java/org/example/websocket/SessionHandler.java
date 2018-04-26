
package org.example.websocket;

import java.io.IOException;
import javax.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;

//import org.example.model.Device;

@ApplicationScoped
public class SessionHandler {
    private final Set<Session> sessions = new HashSet<>();
    //private final Set<Device> devices = new HashSet<>();
    
    public void addSession(Session session) {
        sessions.add(session);
        System.out.println("-----------------------Session added: "+ session.getId());
    }

    public void removeSession(Session session) {
        System.out.println("----------------------Session removed: "+ session.getId());
        sessions.remove(session);
    }
    
    private void sendToSession(Session session, String message) {
        try {
            session.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            sessions.remove(session);
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private void sendToAllConnectedSessions(String message) {
    }
}
