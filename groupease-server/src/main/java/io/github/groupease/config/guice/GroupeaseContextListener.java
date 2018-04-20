package io.github.groupease.config.guice;

import java.lang.invoke.MethodHandles;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

import com.codahale.metrics.Slf4jReporter;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.servlet.GuiceServletContextListener;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Ensures that the Guice Injector is created when the app is deployed.
 */
public class GroupeaseContextListener extends GuiceServletContextListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private static Injector guiceInjector;
    private static ServletContext servletContext;

    private static Config createConfig() {
        LOGGER.info("Creating Typesafe Config.");

        Config config = ConfigFactory.load();

        LOGGER.info("Typesafe Config Created.");

        return config;
    }

    private static void createInjector() {
        LOGGER.info("Creating Guice Injector.");

        Config config = createConfig();

        guiceInjector = Guice.createInjector(
                new GroupeaseGuiceModule(
                        config,
                        servletContext
                )
        );

        LOGGER.info("Guice Injector Created.");
    }

    /**
     * Statically exposes accessor for Guice Injector.
     *
     * @return Guice {@link Injector}.
     */
    public static synchronized Injector getGuiceInjector() {
        if (guiceInjector == null) {
            createInjector();
        }
        return guiceInjector;
    }

    @Override
    public void contextInitialized(
            ServletContextEvent servletContextEvent
    ) {
        /* Store servletContext for later use when creating injector. */
        servletContext = servletContextEvent.getServletContext();
        super.contextInitialized(servletContextEvent);
    }

    @Override
    public void contextDestroyed(
            ServletContextEvent servletContextEvent
    ) {
        Injector injector = getInjector();

        /* Get metrics reporters from Guice to stop them. */
        Slf4jReporter slf4jReporter = injector.getInstance(Slf4jReporter.class);

        if (slf4jReporter != null) {
            /* Report when shutting down so you don't lose the most recent window of data. */
            slf4jReporter.report();

            LOGGER.info("Stopping SLF4J Metrics Reporter");
            slf4jReporter.stop();
            slf4jReporter = null;
        }

        super.contextDestroyed(servletContextEvent);
    }

    @Override
    protected Injector getInjector() {
        return GroupeaseContextListener.getGuiceInjector();
    }

}
