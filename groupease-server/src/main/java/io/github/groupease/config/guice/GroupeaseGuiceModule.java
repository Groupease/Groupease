package io.github.groupease.config.guice;

import javax.annotation.Nonnull;
import javax.servlet.ServletContext;
import javax.ws.rs.client.Client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.AbstractModule;
import com.typesafe.config.Config;
import io.github.groupease.auth.AuthGuiceModule;
import io.github.groupease.channel.ChannelGuiceModule;
import io.github.groupease.channelmember.ChannelMemberGuiceModule;
import io.github.groupease.config.database.DatabaseGuiceModule;
import io.github.groupease.config.jersey.ClientProvider;
import io.github.groupease.config.metrics.MetricsGuiceModule;
import io.github.groupease.user.UserGuiceModule;

import static java.util.Objects.requireNonNull;

/**
 * Guice module for bindings in the Groupease application.
 */
public class GroupeaseGuiceModule extends AbstractModule {

    private final Config config;
    private final ServletContext servletContext;

    /**
     * Constructor.
     *
     * @param config to bind and use in modules.
     * @param servletContext for making reporters available.
     */
    public GroupeaseGuiceModule(
            @Nonnull Config config,
            @Nonnull ServletContext servletContext
    ) {
        this.config = requireNonNull(config);
        this.servletContext = requireNonNull(servletContext);
    }

    @Override
    protected void configure() {

        /* Install other modules. */
        install(new AuthGuiceModule());
        install(new ChannelGuiceModule());
        install(new ChannelMemberGuiceModule());
        install(new DatabaseGuiceModule(config));
        install(new GroupeaseServletGuiceModule());
        install(new MetricsGuiceModule(servletContext));
        install(new UserGuiceModule());

        /* Add bindings. */
        bind(Client.class).toProvider(ClientProvider.class);
        bind(Config.class).toInstance(config);
        bind(ObjectMapper.class).toProvider(ObjectMapperProvider.class);
    }

}
