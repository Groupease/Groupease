package io.github.groupease.config.metrics;

import java.lang.invoke.MethodHandles;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nonnull;
import javax.inject.Inject;
import javax.inject.Provider;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Slf4jReporter;
import com.codahale.metrics.annotation.Timed;
import com.typesafe.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.util.Objects.requireNonNull;

/**
 * Provider for {@link Slf4jReporter}, configuring where and how metrics are logged.
 * The provided reporter will be started.
 */
public class Slf4jReporterProvider implements Provider<Slf4jReporter> {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private static final Logger METRICS_LOGGER = LoggerFactory.getLogger("metrics");

    private static final String LOG_PERIOD_KEY = "groupease.metrics.logReporter.period";

    private final Config config;
    private final MetricRegistry metricRegistry;

    /**
     * Injectable constructor.
     *
     * @param config for application configuration.
     * @param metricRegistry containing metrics to be logged.
     */
    @Inject
    public Slf4jReporterProvider(
            @Nonnull Config config,
            @Nonnull MetricRegistry metricRegistry
    ) {
        this.config = requireNonNull(config);
        this.metricRegistry = requireNonNull(metricRegistry);
    }

    @Nonnull
    @Override
    @Timed
    public Slf4jReporter get() {

        LOGGER.debug("Starting SLF4J Metrics Reporter");

        long reporterPeriodInSeconds = config.getDuration(LOG_PERIOD_KEY, TimeUnit.SECONDS);

        Slf4jReporter metricsReporter = Slf4jReporter.forRegistry(metricRegistry)
                .outputTo(METRICS_LOGGER)
                .convertRatesTo(TimeUnit.SECONDS)
                .convertDurationsTo(TimeUnit.MILLISECONDS)
                .build();

        metricsReporter.start(reporterPeriodInSeconds, TimeUnit.SECONDS);

        LOGGER.info("SLF4J Metrics Reporter Started");

        return metricsReporter;
    }

}
