package io.github.groupease.config.metrics;

import javax.annotation.Nonnull;
import javax.servlet.ServletContext;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Slf4jReporter;
import com.codahale.metrics.health.HealthCheckRegistry;
import com.codahale.metrics.servlet.InstrumentedFilter;
import com.codahale.metrics.servlets.HealthCheckServlet;
import com.codahale.metrics.servlets.MetricsServlet;
import com.google.inject.AbstractModule;
import com.palominolabs.metrics.guice.MetricsInstrumentationModule;

/**
 * Guice module for configuring Dropwizard Metrics.
 */
public class MetricsGuiceModule extends AbstractModule {

    private final ServletContext servletContext;

    /**
     * Constructor.
     *
     * @param servletContext for making reporters available.
     */
    public MetricsGuiceModule(
            @Nonnull ServletContext servletContext
    ) {
        this.servletContext = servletContext;
    }

    @Override
    protected void configure() {

        /* Create registries. */
        MetricRegistry metricRegistry = new MetricRegistry();
        HealthCheckRegistry healthCheckRegistry = new HealthCheckRegistry();

        /*
         * Expose registries to metrics servlets and filters (all may not be used).
         * https://metrics.dropwizard.io/4.0.0/manual/servlet.html
         * https://metrics.dropwizard.io/4.0.0/manual/servlets.html
         */
        servletContext.setAttribute(
                InstrumentedFilter.REGISTRY_ATTRIBUTE,
                metricRegistry
        );

        servletContext.setAttribute(
                HealthCheckServlet.HEALTH_CHECK_REGISTRY,
                healthCheckRegistry
        );

        servletContext.setAttribute(
                MetricsServlet.METRICS_REGISTRY,
                metricRegistry
        );

        /* Install Metrics Guice AOP functionality. */
        install(
                MetricsInstrumentationModule.builder()
                        .withMetricRegistry(metricRegistry)
                        .build()
        );

        /* Bind registries. */
        bind(MetricRegistry.class).toInstance(metricRegistry);
        bind(HealthCheckRegistry.class).toInstance(healthCheckRegistry);

        /* Bind and start reporters. */
        bind(Slf4jReporter.class).toProvider(Slf4jReporterProvider.class).asEagerSingleton();
    }

}
